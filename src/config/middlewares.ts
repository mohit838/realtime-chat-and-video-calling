import express from "express";
import { LOG_MESSAGES } from "./constants.js";
import { corsConfig } from "./cors.js";
import { securityHeaders } from "./helmet.js";
import { metricsMiddleware } from "./metrics.js";
import { connectMongoLogger } from "./mongo-logger.js";
import { apiRateLimiter } from "./rateLimiter.js";

export function registerMiddlewares(app: express.Application) {
  app.use(securityHeaders);
  app.use(corsConfig);
  app.use(express.json());
  app.use(apiRateLimiter);
  app.use(metricsMiddleware);

  connectMongoLogger().catch((err) => {
    console.error(`${LOG_MESSAGES.MONGO_FAIL}:`, err);
  });
}
