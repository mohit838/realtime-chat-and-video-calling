import express from "express";
import { corsConfig } from "./cors.js";
import { securityHeaders } from "./helmet.js";
import { connectMongoLogger } from "./mongo-logger.js";
import { apiRateLimiter } from "./rateLimiter.js";

export function registerMiddlewares(app: express.Application) {
  app.use(securityHeaders);
  app.use(corsConfig);
  app.use(express.json());
  app.use(apiRateLimiter);

  connectMongoLogger().catch((err) => {
    console.error("Mongo Logger connection failed:", err);
  });
}
