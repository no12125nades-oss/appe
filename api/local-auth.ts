import * as jose from "jose";
import * as bcrypt from "bcryptjs";
import * as cookie from "cookie";
import { env } from "./lib/env";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { findUserById } from "./queries/users";
import type { User } from "@db/schema";

const JWT_ALG = "HS256";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<{ userId: number } | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.userId) return null;
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

export async function authenticateRequest(
  headers: Headers
): Promise<User | undefined> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return undefined;
  const claim = await verifySessionToken(token);
  if (!claim) return undefined;
  const user = await findUserById(claim.userId);
  return user ?? undefined;
}

export function clearSessionCookie(headers: Headers): string {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(Session.cookieName, "", {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: 0,
  });
}
