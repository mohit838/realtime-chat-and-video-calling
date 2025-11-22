import express from "express";
import { globalErrorHandler } from "./config/error-handler";
import { registerMiddlewares } from "./config/middlewares";
import { setupSwagger } from "./config/swagger";
import authRouter from "./modules/auth/auth.routes";

import { ROUTES } from "./config/constants";

const app = express();

// Auto middlewares
registerMiddlewares(app);

// Swagger setup
setupSwagger(app);

// Routes
app.use(ROUTES.AUTH, authRouter);

// Test routes
app.get("/", (_, res) => res.json({ message: "ok" }));

// Global error handler
app.use(globalErrorHandler);

export default app;
