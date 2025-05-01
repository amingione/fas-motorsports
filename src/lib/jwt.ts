import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

interface JWTPayload {
  _id: string;
  [key: string]: unknown;
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}