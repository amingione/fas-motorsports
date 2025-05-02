import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@/lib/sanityClient';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({ message: 'Missing password or token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string; userRole: string };

    const passwordHash = await bcrypt.hash(password, 10);

    const docId = decoded._id;
    const docType = decoded.userRole === 'vendor' ? 'vendor' : 'customer';

    await sanityClient
      .patch(docId)
      .set({ passwordHash })
      .commit({ autoGenerateArrayKeys: true });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ message });
  }
}
