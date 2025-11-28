import "dotenv/config";
import type { Server } from "http";
import app from "./app";
import { testDbConnection } from "./config/db";
import { env } from "./config/env";
import { testKafkaConnection } from "./config/kafka";
import { setupMongoTTL } from "./config/mongo-ttl";
import { testRedisConnection } from "./config/redis";
import { setupGracefulShutdown } from "./config/shutdown";

let server: Server;

async function start() {
  await Promise.all([testDbConnection(), testRedisConnection(), testKafkaConnection()]);

  server = app.listen(env.APP_PORT, () => {
    console.debug(`Server running at http://localhost:${env.APP_PORT}`);
  });

  await setupMongoTTL();

  setupGracefulShutdown(server);
}

start();

export { server };
