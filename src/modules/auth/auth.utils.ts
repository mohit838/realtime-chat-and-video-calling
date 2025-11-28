import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";
import type { AuthTokenPayload } from "./auth.types.js";
import { randomUUID } from "crypto";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export function generateRefreshToken(): string {
  return randomUUID();
}

export async function signToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.JWT_EXPIRY)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AuthTokenPayload;
}
