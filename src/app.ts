import express from "express";

const app = express();

// Middlewares
app.use(express.json());

// Test Routes
app.get("/", (_, res) => {
  res.json({ message: "ok" });
});

export default app;
