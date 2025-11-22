import express from "express";
import { corsConfig } from "./cors";
import { securityHeaders } from "./helmet";
import { connectMongoLogger } from "./mongo-logger";
import { apiRateLimiter } from "./rateLimiter";

export function registerMiddlewares(app: express.Application) {
  app.use(securityHeaders);
  app.use(corsConfig);
  app.use(express.json());
  app.use(apiRateLimiter);

  connectMongoLogger().catch((err) => {
    console.error("Mongo Logger connection failed:", err);
  });
}
