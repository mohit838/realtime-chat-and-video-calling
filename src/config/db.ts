import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "test_db",
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
