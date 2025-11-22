import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import authRouter from "./modules/auth/auth.routes";

app.use("/api/auth", authRouter);

// Test Routes (do not remove)
app.get("/", (_, res) => {
  res.json({ message: "ok" });
});

app.post("/health", (req, res) => {
  res.json({ message: req.body });
});

export default app;
