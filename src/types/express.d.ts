import "express";
import type { AuthTokenPayload } from "../modules/auth/auth.types";

declare module "express" {
  interface Request {
    user?: AuthTokenPayload;
    requestId?: string;
  }
}
