import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const client = createClient({
  projectId: 'r4og35qd',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const JWT_SECRET = process.env.JWT_SECRET || '';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = `*[_type == "customer" && email == $email][0]`;
  const customer = await client.fetch(query, { email });

  if (!customer || !customer.passwordHash) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, customer.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      _id: customer._id,
      email: customer.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  try {
    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Login Successful',
      html: `<p>Hello ${customer.firstName || 'there'}, you just signed in to FAS Motorsports.</p>`,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Login email failed to send:', err.message);
    } else {
      console.error('Login email failed to send:', err);
    }
  }

  res.setHeader('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }));

  return res.status(200).json({
    user: {
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    },
  });
}
