import type { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { logger } from "../config/logger.js";

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const requestId = uuid();
  req.requestId = requestId;

  logger.info("Incoming request", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    userId: req.user?.id ?? null,
  });

  next();
}
