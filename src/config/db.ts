import mysql from "mysql2/promise";
import { env } from "./env.js";

let pool: mysql.Pool | null = null;

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      user: env.db.user,
      port: env.db.port,
      password: env.db.pass,
      database: env.db.name,
      waitForConnections: true,
      connectionLimit: 10,
    });

    console.debug("## MySQL Pool Created (Singleton)");
  }

  return pool;
};

export const testDbConnection = async () => {
  try {
    const conn = await getDb().getConnection();
    await conn.ping();
    conn.release();
    console.debug("MySQL Connected");
  } catch (err) {
    console.error("MySQL Connection Failed");
    console.error(err);
    process.exit(1);
  }
};
