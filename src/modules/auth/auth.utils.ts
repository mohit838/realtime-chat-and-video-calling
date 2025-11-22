import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env";
import type { AuthTokenPayload } from "./auth.types";
import { randomUUID } from "crypto";

const secret = new TextEncoder().encode(env.jwt.secret);

export function generateRefreshToken(): string {
  return randomUUID();
}

export async function signToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.jwt.expiry)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AuthTokenPayload;
}
