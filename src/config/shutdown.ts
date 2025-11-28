import type { Server } from "http";
import { LOG_MESSAGES, SHUTDOWN_SIGNALS } from "./constants.js";
import { getDb } from "./db.js";
import { getKafkaProducer } from "./kafka.js";
import { getRedis } from "./redis.js";

export function setupGracefulShutdown(server: Server) {
  const handler = async (signal: string) => {
    console.debug(`\n## Received ${signal}. Shutting down gracefully...`);

    // 1. Close HTTP server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.debug(LOG_MESSAGES.HTTP_CLOSED);
    }

    // 2. Close MySQL
    try {
      await getDb().end();
      console.debug(LOG_MESSAGES.MYSQL_CLOSED);
    } catch (err) {
      console.error("## Error closing MySQL:", err);
    }

    // 3. Close Redis
    try {
      await getRedis().quit();
      console.debug(LOG_MESSAGES.REDIS_CLOSED);
    } catch (err) {
      console.error("## Error closing Redis:", err);
    }

    // 4. Close Kafka
    try {
      await getKafkaProducer().disconnect();
      console.debug(LOG_MESSAGES.KAFKA_CLOSED);
    } catch (err) {
      console.error("## Error closing Kafka:", err);
    }

    process.exit(0);
  };

  SHUTDOWN_SIGNALS.forEach((sig) => {
    process.on(sig, () => handler(sig));
  });

  process.on("uncaughtException", (err) => {
    console.error("## UNCAUGHT EXCEPTION:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("## UNHANDLED REJECTION:", reason);
    process.exit(1);
  });
}
