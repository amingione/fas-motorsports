import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
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
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Expiration validation fallback
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    const user = await sanity.fetch(
      `*[_type == "customer" && _id == $id][0]{
        _id,
        email,
        firstName,
        lastName,
        phone,
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
    if (err instanceof Error) {
      console.error('Auth error:', err.message);
    } else {
      console.error('Auth error:', err);
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
