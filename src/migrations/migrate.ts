import fs from "fs";
import type { RowDataPacket } from "mysql2/promise";
import path from "path";
import { getDb } from "../config/db";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

type Direction = "up" | "down";

interface MigrationRow extends RowDataPacket {
  id: number;
  name: string;
  batch: number;
  direction: string;
}

// ------------------------------
// Utilities
// ------------------------------
function readSql(file: string): string {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8").trim();
}

function extractName(file: string): string {
  return file.replace(/\.(up|down)\.sql$/, "");
}

async function ensureTable() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      batch INT NOT NULL,
      direction ENUM('up','down') NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// ------------------------------
// Fetch helpers
// ------------------------------
async function getApplied(direction: Direction): Promise<string[]> {
  const db = getDb();
  const [rows] = await db.query<MigrationRow[]>(
    "SELECT name FROM migrations WHERE direction = ? ORDER BY id",
    [direction]
  );

  return rows.map((r) => r.name);
}

async function getNextBatch(): Promise<number> {
  const db = getDb();
  const [rows] = await db.query<(RowDataPacket & { batch: number })[]>(
    "SELECT MAX(batch) AS batch FROM migrations WHERE direction = 'up'"
  );

  return (rows[0]?.batch ?? 0) + 1;
}

// ------------------------------
// Apply a single migration
// ------------------------------
async function runMigration(file: string, direction: Direction, batch: number) {
  const db = getDb();
  const sql = readSql(file);
  const name = extractName(file);

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    await conn.query(sql);

    await conn.query("INSERT INTO migrations (name, direction, batch) VALUES (?, ?, ?)", [
      name,
      direction,
      batch,
    ]);

    await conn.commit();
    console.debug(`${direction.toUpperCase()}: ${file}`);
  } catch (err) {
    await conn.rollback();
    console.error(`FAILED: ${file}`);
    console.error(err);
    process.exit(1);
  } finally {
    conn.release();
  }
}

// ------------------------------
// UP ALL
// ------------------------------
async function upAll() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".up.sql"))
    .sort();

  const applied = await getApplied("up");
  const batch = await getNextBatch();

  for (const f of files) {
    if (applied.includes(extractName(f))) {
      console.debug(`SKIP: ${f}`);
      continue;
    }
    await runMigration(f, "up", batch);
  }
}

// ------------------------------
// DOWN ALL
// ------------------------------
async function downAll() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".down.sql"))
    .sort()
    .reverse(); // important

  const appliedDown = await getApplied("down");

  for (const f of files) {
    const name = extractName(f);

    if (appliedDown.includes(name)) {
      console.debug(`SKIP: ${f}`);
      continue;
    }

    await runMigration(f, "down", 0);
  }
}

// ------------------------------
// ROLLBACK LAST BATCH
// ------------------------------
async function rollback() {
  const db = getDb();

  const [rows] = await db.query<MigrationRow[]>(
    "SELECT batch FROM migrations WHERE direction='up' ORDER BY batch DESC LIMIT 1"
  );

  if (rows.length === 0) {
    console.debug("No batches to rollback.");
    return;
  }

  const batch = rows[0].batch;

  const [migs] = await db.query<MigrationRow[]>(
    "SELECT name FROM migrations WHERE batch = ? AND direction='up' ORDER BY id DESC",
    [batch]
  );

  for (const m of migs) {
    const downFile = fs
      .readdirSync(MIGRATIONS_DIR)
      .find((f) => f.startsWith(m.name) && f.endsWith(".down.sql"));

    if (!downFile) {
      console.error(`Missing down file for ${m.name}`);
      process.exit(1);
    }

    await runMigration(downFile, "down", batch);

    await db.execute("DELETE FROM migrations WHERE name = ? AND direction='up'", [m.name]);
    await db.execute("DELETE FROM migrations WHERE name = ? AND direction='down'", [m.name]);
  }

  console.debug(`Rolled back batch ${batch}`);
}

// ------------------------------
// MAIN
// ------------------------------
(async () => {
  await ensureTable();

  const cmd = process.argv[2];
  const name = process.argv[3];

  if (cmd === "up") {
    if (name) {
      const file = fs
        .readdirSync(MIGRATIONS_DIR)
        .find((f) => f.startsWith(name) && f.endsWith(".up.sql"));

      if (!file) return console.error("Migration not found.");
      const batch = await getNextBatch();
      await runMigration(file, "up", batch);
    } else {
      await upAll();
    }
  } else if (cmd === "down") {
    if (name) {
      const file = fs
        .readdirSync(MIGRATIONS_DIR)
        .find((f) => f.startsWith(name) && f.endsWith(".down.sql"));
      if (!file) return console.error("Migration not found.");
      await runMigration(file, "down", 0);
    } else {
      await downAll();
    }
  } else if (cmd === "rollback") {
    await rollback();
  } else {
    console.debug("Usage:");
    console.debug("  npm run migrate up");
    console.debug("  npm run migrate up 0001_init");
    console.debug("  npm run migrate down");
    console.debug("  npm run migrate rollback");
  }

  process.exit(0);
})();
