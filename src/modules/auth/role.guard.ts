import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../../types/api-response";
import { logWarn } from "../../utils/log";

export function roleGuard(allowed: string | string[]) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json(errorResponse(null, "Unauthorized"));
    }

    const hasRole = user.roles?.some((r) => roles.includes(r));

    if (!hasRole) {
      logWarn("Forbidden: Role mismatch", {
        requestId: req.requestId,
        userId: user.id,
        requiredRoles: roles,
        userRoles: user.roles,
      });

      return res.status(403).json(errorResponse(null, "Forbidden"));
    }

    next();
  };
}
