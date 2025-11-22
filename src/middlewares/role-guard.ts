import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../types/api-response";
import { logInfo, logWarn } from "../utils/log";

/**
 * Role-based Access Control (RBAC)
 *
 * Usage:
 *    router.get("/admin", authGuard, roleGuard("admin"), handler)
 *    router.get("/mod-or-admin", authGuard, roleGuard("moderator", "admin"), handler)
 */
export function roleGuard(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      logWarn("Access denied: No authenticated user", {
        requestId: req.requestId,
        path: req.originalUrl,
      });

      return res.status(401).json(errorResponse(null, "Unauthorized"));
    }

    const hasAccess = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      logWarn("Access denied: Insufficient role", {
        requestId: req.requestId,
        userId: user.id,
        requiredRoles: allowedRoles,
        userRoles: user.roles,
        path: req.originalUrl,
      });

      return res.status(403).json(errorResponse(null, "Forbidden: Access denied"));
    }

    logInfo("RoleGuard passed", {
      requestId: req.requestId,
      userId: user.id,
      userRoles: user.roles,
      allowedRoles,
    });

    next();
  };
}
