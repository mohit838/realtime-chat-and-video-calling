import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env";

const encoder = new TextEncoder();
const SECRET_KEY = encoder.encode(env.jwt.secret);

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.jwt.expiry)
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload;
}
