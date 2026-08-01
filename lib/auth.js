import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'curry-puff-secret-key-super-secure-2026';
const TOKEN_NAME = 'curry_auth_token';

/**
 * Hash a plain text password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Verify password match
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Sign JWT token for user
 */
export function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authenticate incoming request and retrieve current User
 * Returns user object or null if unauthenticated
 */
export async function getAuthUser(req) {
  try {
    let token = null;

    // 1. Try reading token from Authorization header
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // 2. Fallback to cookie
    if (!token) {
      const cookieStore = cookies();
      const authCookie = cookieStore.get(TOKEN_NAME);
      if (authCookie) {
        token = authCookie.value;
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, created_at: true },
    });

    return user;
  } catch (err) {
    console.error('getAuthUser Error:', err);
    return null;
  }
}

export { TOKEN_NAME };
