import express from "express";

const app = express();

// Middlewares
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "ok" }));

app.listen(1234, () => {
  console.warn(`Server running on http://localhost:1234`);
});

export default app;
