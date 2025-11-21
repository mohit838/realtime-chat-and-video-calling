import fs from "fs";
import type { RowDataPacket } from "mysql2/promise";
import path from "path";
import { getDb } from "../config/db";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

type Direction = "up" | "down" | "rollback";

interface RowBatch extends RowDataPacket {
  batch: number | null;
}

interface RowName extends RowDataPacket {
  name: string;
}

// Extract 0001_init from filename
function extractName(file: string): string {
  return file.replace(/\.(up|down)\.sql$/, "");
}

function readSql(file: string): string {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8").trim();
}

// Ensure migrations table exists
async function ensureMigrationTable(): Promise<void> {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      batch INT NOT NULL,
      direction ENUM('up', 'down') NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Get applied migrations for a direction
async function getApplied(direction: "up" | "down"): Promise<string[]> {
  const db = getDb();
  const [rows] = await db.query<RowName[]>(
    "SELECT name FROM migrations WHERE direction = ? ORDER BY id ASC",
    [direction]
  );

  return rows.map((r) => r.name);
}

// Record migration
async function recordMigration(name: string, direction: Direction, batch: number): Promise<void> {
  const db = getDb();
  await db.query("INSERT INTO migrations (name, direction, batch) VALUES (?, ?, ?)", [
    name,
    direction,
    batch,
  ]);
}

// Next batch number
async function getNextBatch(): Promise<number> {
  const db = getDb();
  const [rows] = await db.query<RowBatch[]>("SELECT MAX(batch) AS batch FROM migrations");
  const lastBatch = rows[0]?.batch ?? 0;
  return lastBatch + 1;
}

// Run a single migration file
async function runMigration(file: string, direction: "up" | "down", batch: number): Promise<void> {
  const db = getDb();
  const name = extractName(file);
  const sql = readSql(file);

  if (!sql) {
    console.error(`## Empty SQL in file: ${file}`);
    process.exit(1);
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(sql);
    await recordMigration(name, direction, batch);
    await conn.commit();

    console.debug(`## Applied: ${file}`);
  } catch (err) {
    await conn.rollback();
    console.error(`## Migration FAILED: ${file}`);
    console.error(err);
    process.exit(1);
  } finally {
    conn.release();
  }
}

// Run ALL migrations for direction
async function runAll(direction: "up" | "down"): Promise<void> {
  const applied = await getApplied(direction);

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(`.${direction}.sql`))
    .sort();

  const nextBatch = await getNextBatch();

  for (const file of files) {
    const name = extractName(file);

    if (applied.includes(name)) {
      console.debug(`## Skipped (already applied): ${file}`);
      continue;
    }

    await runMigration(file, direction, nextBatch);
  }

  console.debug("## Completed all migrations.");
}

// Run ONE migration
async function runOne(direction: "up" | "down", name: string): Promise<void> {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.startsWith(name) && f.endsWith(`.${direction}.sql`));

  if (files.length === 0) {
    console.error(`## Migration not found: ${name}.${direction}.sql`);
    process.exit(1);
  }

  const nextBatch = await getNextBatch();
  await runMigration(files[0], direction, nextBatch);
}

// ---------- ROLLBACK LOGIC ----------

// Get last batch that ran as UP
async function getLastBatchNumber(): Promise<number | null> {
  const db = getDb();
  const [rows] = await db.query<RowBatch[]>(
    "SELECT MAX(batch) AS batch FROM migrations WHERE direction = 'up'"
  );
  return rows[0]?.batch ?? null;
}

// Get migrations for a specific batch
async function getBatchMigrations(batch: number): Promise<RowName[]> {
  const db = getDb();
  const [rows] = await db.query<RowName[]>(
    "SELECT name FROM migrations WHERE batch = ? AND direction = 'up' ORDER BY id DESC",
    [batch]
  );
  return rows;
}

// Rollback last batch (Laravel-style)
async function rollbackBatch(batch: number): Promise<void> {
  console.debug(`## Rolling back batch: ${batch}`);

  const migrations = await getBatchMigrations(batch);

  if (migrations.length === 0) {
    console.debug(`## No migrations found for batch ${batch}`);
    process.exit(0);
  }

  for (const m of migrations) {
    const downFile = fs
      .readdirSync(MIGRATIONS_DIR)
      .find((f) => f.startsWith(m.name) && f.endsWith(".down.sql"));

    if (!downFile) {
      console.error(`## Missing down migration for: ${m.name}`);
      process.exit(1);
    }

    await runMigration(downFile, "down", batch);
  }

  console.debug(`## Successfully rolled back batch ${batch}`);
}

// ---------- MAIN CLI ----------
async function main(): Promise<void> {
  await ensureMigrationTable();

  const direction = process.argv[2] as Direction | undefined;
  const name = process.argv[3];

  // --------- ROLLBACK MODE ---------
  if (direction === "rollback") {
    const batchArg = name ? Number(name) : null;
    const lastBatch = batchArg || (await getLastBatchNumber());

    if (!lastBatch) {
      console.debug("## No batches to rollback.");
      process.exit(0);
    }

    await rollbackBatch(lastBatch);
    process.exit(0);
  }

  // --------- UP / DOWN ---------
  if (!direction || (direction !== "up" && direction !== "down")) {
    console.error("Usage:");
    console.error("  npm run migrate up");
    console.error("  npm run migrate down");
    console.error("  npm run migrate up 0001_init");
    console.error("  npm run migrate down 0001_init");
    console.error("  npm run migrate rollback");
    console.error("  npm run migrate rollback 2");
    process.exit(1);
  }

  if (name) {
    await runOne(direction, name);
  } else {
    await runAll(direction);
  }

  process.exit(0);
}

main();
