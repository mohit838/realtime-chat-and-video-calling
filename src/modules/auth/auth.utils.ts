import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env";
import type { AuthTokenPayload } from "./auth.types";

const encoder = new TextEncoder();
const SECRET_KEY = encoder.encode(env.jwt.secret);

export async function signToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.jwt.expiry)
    .setIssuer("realtime-chat")
    .setAudience("realtime-chat-user")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET_KEY, {
    issuer: "realtime-chat",
    audience: "realtime-chat-user",
  });

  return payload as AuthTokenPayload;
}
