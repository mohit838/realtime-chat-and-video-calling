import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth.utils";
import { errorResponse } from "../../types/api-response";
import { logInfo, logWarn } from "../../utils/log";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    logWarn("Unauthorized access attempt: Missing Bearer token", {
      requestId: req.requestId,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(401).json(errorResponse(null, "Unauthorized"));
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verifyToken(token);

    req.user = {
      id: Number(payload.id),
      email: String(payload.email),
    };

    logInfo("AuthGuard passed", {
      requestId: req.requestId,
      userId: req.user.id,
      path: req.originalUrl,
    });

    next();
  } catch (err) {
    logWarn("Invalid or expired token", {
      requestId: req.requestId,
      path: req.originalUrl,
    });

    return res.status(401).json(errorResponse(err, "Invalid or expired token"));
  }
};
