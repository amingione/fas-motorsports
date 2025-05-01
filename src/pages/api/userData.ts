import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import sanityClient from '@/lib/sanityClient';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const userId = decoded._id;

    const ordersQuery = `*[_type == "order" && customer._ref == $userId]`;
    const quotesQuery = `*[_type == "quote" && customer._ref == $userId]`;

    const [orders, quotes] = await Promise.all([
      sanityClient.fetch(ordersQuery, { userId }),
      sanityClient.fetch(quotesQuery, { userId })
    ]);

    res.status(200).json({ orders, quotes });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('JWT auth error:', err.message);
    } else {
      console.error('JWT auth error:', err);
    }
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}