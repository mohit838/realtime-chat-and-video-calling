import { json } from "body-parser";
import cors from "cors";
import express from "express";

import authRouter from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/auth", authRouter);

export default app;
