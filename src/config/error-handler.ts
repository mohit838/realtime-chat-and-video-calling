import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../types/api-response.js";
import type { ExtendedRequest } from "../types/extended-request.js";
import { logError } from "../utils/log.js";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const r = req as ExtendedRequest;

  logError("GLOBAL ERROR", {
    requestId: r.requestId,
    userId: r.user?.id,
    path: r.originalUrl,
    method: r.method,
    error: err,
  });

  if (err instanceof ZodError) {
    return res.status(400).json(errorResponse(err, "Validation failed"));
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  return res.status(500).json(errorResponse(err, message));
};
