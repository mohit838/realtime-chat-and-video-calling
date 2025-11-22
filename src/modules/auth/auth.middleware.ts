import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../../types/api-response";
import { logInfo, logWarn } from "../../utils/log";
import { verifyToken } from "./auth.utils";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    logWarn("Unauthorized request", {
      requestId: req.requestId,
      path: req.originalUrl,
    });

    return res.status(401).json(errorResponse(null, "Unauthorized"));
  }

  try {
    const payload = await verifyToken(header.substring(7));

    req.user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };

    logInfo("AuthGuard passed", {
      requestId: req.requestId,
      userId: req.user.id,
    });

    next();
  } catch (err) {
    return res.status(401).json(errorResponse(err, "Invalid or expired token"));
  }
};
