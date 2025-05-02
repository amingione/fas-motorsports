import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { createClient } from '@sanity/client';

const JWT_SECRET = process.env.JWT_SECRET || '';
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface DecodedToken {
  _id: string;
  email: string;
  iat: number;
  exp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

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
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
