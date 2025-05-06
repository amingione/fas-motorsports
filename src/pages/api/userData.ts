import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import sanityClient from '@/lib/sanityClient';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeaderRaw = req.headers['authorization'] || req.headers['Authorization'];
  const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const userId = decoded._id;

    const userDoc = await sanityClient.fetch(
      `*[_id == $userId][0]{ _id, _type }`,
      { userId }
    );

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Authenticated ${userDoc._type} with ID ${userId}`);

    let responsePayload: Record<string, unknown> = {};

    if (userDoc._type === 'customer') {
      const [orders, quotes] = await Promise.all([
        sanityClient.fetch(`*[_type == "order" && customer._ref == $userId]`, { userId }),
        sanityClient.fetch(`*[_type == "quote" && customer._ref == $userId]`, { userId }),
      ]);
      responsePayload = { orders, quotes };
    } else if (userDoc._type === 'vendor') {
      const appointments = await sanityClient.fetch(
        `*[_type == "appointment" && vendor._ref == $userId]`,
        { userId }
      );
      responsePayload = { appointments };
    } else {
      return res.status(400).json({ message: 'Unsupported user type' });
    }

    return res.status(200).setHeader('Cache-Control', 'no-store').json(responsePayload);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('JWT auth error:', errorMessage);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}