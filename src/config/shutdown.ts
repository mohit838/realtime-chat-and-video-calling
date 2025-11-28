import type { Server } from "http";
import { LOG_MESSAGES, SHUTDOWN_SIGNALS } from "./constants.js";
import { getDb } from "./db.js";
import { getKafkaProducer } from "./kafka.js";
import { getRedis } from "./redis.js";

let isShuttingDown = false;

export function setupGracefulShutdown(server: Server) {
  const handler = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.debug(`\n## Received ${signal}. Shutting down gracefully...`);

    // 1. Close HTTP server
    try {
      await new Promise((resolve) => server.close(resolve));
      console.debug(LOG_MESSAGES.HTTP_CLOSED);
    } catch (err) {
      console.error("## Error closing HTTP server:", err);
    }

    // 2. Close database + redis + kafka
    const tasks = [
      (async () => {
        try {
          await getDb().end();
          console.debug(LOG_MESSAGES.MYSQL_CLOSED);
        } catch (err) {
          console.error("## Error closing MySQL:", err);
        }
      })(),

      (async () => {
        try {
          await getRedis().quit();
          console.debug(LOG_MESSAGES.REDIS_CLOSED);
        } catch (err) {
          console.error("## Error closing Redis:", err);
        }
      })(),

      (async () => {
        try {
          await getKafkaProducer().disconnect();
          console.debug(LOG_MESSAGES.KAFKA_CLOSED);
        } catch (err) {
          console.error("## Error closing Kafka:", err);
        }
      })(),
    ];

    await Promise.allSettled(tasks);

    console.debug("## Shutdown complete.");
    process.exit(0);
  };

  // Attach shutdown listeners
  SHUTDOWN_SIGNALS.forEach((sig) => {
    process.on(sig, () => handler(sig));
  });

  process.on("uncaughtException", (err) => {
    console.error("## UNCAUGHT EXCEPTION:", err);
    handler("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("## UNHANDLED REJECTION:", reason);
    handler("unhandledRejection");
  });
}
