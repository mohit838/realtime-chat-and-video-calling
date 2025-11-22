import "express";
import type { AuthUser } from "../modules/auth/auth.types";

declare module "express" {
  interface Request {
    user?: AuthUser;
    requestId?: string;
  }
}
