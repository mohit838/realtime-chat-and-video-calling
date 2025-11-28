import cors from "cors";
import { env } from "./env.js";

export const corsConfig = cors({
  origin: env.app.corsOrigin || "*",
  credentials: true,
});
