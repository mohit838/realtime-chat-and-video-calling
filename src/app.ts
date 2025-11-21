import cors from "cors";
import express from "express";

import authRouter from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

// Test Routes (do not remove)
app.get("/", (_, res) => {
  res.json({ message: "ok" });
});

export default app;
