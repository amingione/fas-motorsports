import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { createClient } from '@sanity/client';

interface DecodedToken {
  _id: string;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || '';
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.SANITY_API_TOKEN) {
    return res.status(500).json({ message: 'Server misconfigured: missing SANITY_API_TOKEN' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'Server misconfigured: missing JWT_SECRET' });
  }

  const allowedOrigins = [
    'https://fasmotorsports.com',
    'https://www.fasmotorsports.com',
    'https://vendor.fasmotorsports.com',
    'https://fasmotorsports.io',
    'https://www.fasmotorsports.io',
    'http://localhost:4321',
  ];
  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Origin not allowed' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    console.log("Incoming request to /api/me", { origin, cookies, token });

    if (!token) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    const user = await sanity.fetch(
      `*[_id == $id][0]{
        _id,
        _type,
        email,
        firstName,
        lastName,
        phone,
        userRole,
        orderCount,
        quoteCount,
        lifetimeSpend
      }`,
      { id: decoded._id }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Auth error:', errorMessage);

    return res.status(401).json({
      message:
        errorMessage.includes('jwt expired')
          ? 'Token has expired'
          : 'Invalid or expired token',
    });
  }
}
