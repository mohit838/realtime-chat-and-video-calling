import express, { type Application } from "express";
import { ROUTES } from "./config/constants.js";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./config/error-handler.js";
import { metricsHandler } from "./config/metrics.js";
import { registerMiddlewares } from "./config/middlewares.js";
import { setupSwagger } from "./config/swagger.js";
import authRouter from "./modules/auth/auth.routes.js";

const app: Application = express();

// Auto middlewares
registerMiddlewares(app);

// Swagger
if (env.APP_ENV === "development") {
  setupSwagger(app);
} else {
  app.use("/docs", (_, res) => res.status(404).send("Not available in production"));
}

// Metrics
app.get("/metrics", metricsHandler);

// Routes
app.use(ROUTES.AUTH, authRouter);

// Test route
app.get("/", (_, res) => res.status(200).json({ message: "ok" }));

// 404 route
app.get("", (_, res) => res.status(404).json({ message: "Route not found!" }));

// Global error handler
app.use(globalErrorHandler);

export default app;
