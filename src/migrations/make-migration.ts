import fs from "fs";
import path from "path";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

function pad(n: number) {
  return n.toString().padStart(4, "0");
}

function getNextNumber(): number {
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const nums = files
    .map((f) => f.split("_")[0])
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));

  return nums.length ? Math.max(...nums) + 1 : 1;
}

function main() {
  const name = process.argv[2];

  if (!name) {
    console.error("Usage: npm run make:migration <name>");
    process.exit(1);
  }

  const num = pad(getNextNumber());
  const base = `${num}_${name}`;

  const upFile = path.join(MIGRATIONS_DIR, `${base}.up.sql`);
  const downFile = path.join(MIGRATIONS_DIR, `${base}.down.sql`);

  const upTemplate = `-- Migration: ${base}.up.sql\n-- Write your SQL here\n`;
  const downTemplate = `-- Migration: ${base}.down.sql\n-- Write your SQL here\n`;

  fs.writeFileSync(upFile, upTemplate);
  fs.writeFileSync(downFile, downTemplate);

  console.debug(`Created: ${upFile}`);
  console.debug(`Created: ${downFile}`);
}

main();
