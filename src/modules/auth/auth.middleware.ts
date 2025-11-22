import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth.utils";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    const payload = await verifyToken(token);

    req.user = {
      id: Number(payload.id),
      email: String(payload.email),
      ...payload,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
