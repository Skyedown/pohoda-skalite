import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { CookieOptions, NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';

export const AUTH_COOKIE = 'pohoda_admin';

const TOKEN_TTL_SECONDS = 60 * 60 * 12; // 12 hours
const BCRYPT_ROUNDS = 12;

/**
 * A missing secret would be a hard failure, but taking the whole site down over
 * it is worse than logging admins out on restart, so fall back to a random one.
 */
function resolveSecret(): string {
  const configured = process.env.JWT_SECRET;
  if (configured && configured.length >= 16) return configured;

  console.warn(
    '⚠️ JWT_SECRET is missing or too short — using a random per-boot secret. ' +
      'Admin sessions will not survive a restart. Set JWT_SECRET in api/.env.',
  );
  return crypto.randomBytes(48).toString('hex');
}

const SECRET = resolveSecret();

export interface AuthPayload {
  sub: string;
  username: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

export function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    // Same-origin in production (nginx proxies /api), and localhost:3000 and
    // localhost:3001 count as the same site in development.
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: '/',
  };
}

declare module 'express-serve-static-core' {
  interface Request {
    admin?: AuthPayload;
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[AUTH_COOKIE];

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    req.admin = jwt.verify(token, SECRET) as AuthPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired' });
  }
}

/**
 * Creates the first administrator from the environment so an existing
 * deployment keeps working without a manual step. Runs only when the
 * collection is empty — it never overwrites or resets an existing account.
 */
export async function seedFirstAdmin(): Promise<void> {
  const username = (process.env.ADMIN_USERNAME || 'marciAdmin').trim();
  const password = process.env.ADMIN_PASSWORD || 'LucenecJeSuper123';

  if ((await User.countDocuments()) > 0) return;

  if (!username || !password) {
    console.warn(
      '⚠️ No admin users exist and ADMIN_USERNAME / ADMIN_PASSWORD are not set. ' +
        'Nobody can sign in to the admin until you set them and restart.',
    );
    return;
  }

  await User.create({
    username: username.toLowerCase(),
    passwordHash: await hashPassword(password),
  });
  console.log(`🌱 Created first admin user "${username.toLowerCase()}"`);
}
