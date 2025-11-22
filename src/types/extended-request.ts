import type { Request } from "express";
import type { AuthTokenPayload } from "../modules/auth/auth.types";

export interface ExtendedRequest extends Request {
  user?: AuthTokenPayload;
  requestId?: string;
}
