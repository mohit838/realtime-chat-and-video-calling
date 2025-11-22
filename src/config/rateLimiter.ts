import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each user to 100 requests/min
  standardHeaders: true,
  legacyHeaders: false,
});
