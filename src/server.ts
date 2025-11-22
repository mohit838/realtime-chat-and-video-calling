import "dotenv/config";
import type { Server } from "http";
import app from "./app";
import { testDbConnection } from "./config/db";
import { env } from "./config/env";
import { testKafkaConnection } from "./config/kafka";
import { testRedisConnection } from "./config/redis";
import { setupGracefulShutdown } from "./config/shutdown";

let server: Server;

async function start() {
  await Promise.all([testDbConnection(), testRedisConnection(), testKafkaConnection()]);

  server = app.listen(env.app.port, () => {
    console.debug(`Server running at http://localhost:${env.app.port}`);
  });

  setupGracefulShutdown(server);
}

start();

export { server };
