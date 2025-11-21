import "dotenv/config";
import type { Server } from "http";
import app from "./app";
import { getDb, testDbConnection } from "./config/db";
import { getRedis, testRedisConnection } from "./config/redis";

const PORT = process.env.PORT || 1234;

let server: Server;

const startServer = async () => {
  await testDbConnection();
  await testRedisConnection();

  server = app.listen(PORT, () => {
    console.debug(`Server running at http://localhost:${PORT}`);
  });
};

startServer();

// ----------------------------
// Graceful Shutdown Handler
// ----------------------------
const gracefulShutdown = async (signal: string) => {
  console.debug(`\n ## Received ${signal}. Shutting down gracefully...`);

  // 1. Stop accepting new requests
  if (server) {
    server.close(() => {
      console.debug("HTTP server closed.");
    });
  }

  // 2. Close MySQL pool
  try {
    const pool = getDb();
    await pool.end();
    console.debug("## MySQL pool closed.");
  } catch (err) {
    console.error("## Error closing MySQL pool:", err);
  }

  // 3. Close Redis connection
  try {
    const redis = getRedis();
    redis.destroy();
    console.debug("## Redis client disconnected.");
  } catch (err) {
    console.error("## Error closing Redis client:", err);
  }

  // 4. Exit
  process.exit(0);
};

// Signals to catch
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

// Catch unhandled errors
process.on("uncaughtException", (err) => {
  console.error("## UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("## UNHANDLED REJECTION:", reason);
  process.exit(1);
});
