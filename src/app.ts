import express from "express";
import { ROUTES } from "./config/constants";
import { globalErrorHandler } from "./config/error-handler";
import { registerMiddlewares } from "./config/middlewares";
import { requestLogger } from "./middlewares/request-logger";
import authRouter from "./modules/auth/auth.routes";

const app = express();

registerMiddlewares(app);
app.use(requestLogger);

app.use(ROUTES.AUTH, authRouter);

app.get(ROUTES.ROOT, (_, res) => res.json({ message: "ok" }));
app.post(ROUTES.HEALTH, (req, res) => res.json({ status: "ok", data: req.body }));

app.use(globalErrorHandler);

export default app;
