import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '../../emails/WelcomeEmail';
import React from 'react';
import { serialize } from 'cookie';

const client = createClient({
  projectId: 'r4og35qd',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const JWT_SECRET = process.env.JWT_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, firstName, lastName, userRole } = req.body;
  const role = userRole === 'vendor' ? 'vendor' : 'customer';
  console.log('📥 Received register payload:', { email, password: !!password, firstName, lastName, userRole: role });

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await client.fetch(`*[_type in ["customer", "vendor"] && email == $email][0]`, { email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'vendor') {
      return res.status(403).json({
        message: 'Vendor accounts must be approved. Please submit an application at /vendor/application.',
      });
    }

    const userDoc = {
      _type: 'customer',
      email,
      firstName,
      lastName,
      passwordHash,
      userRole: 'customer',
    };

    const newCustomer = await client.create(userDoc);
    const token = jwt.sign({ _id: newCustomer._id }, JWT_SECRET, { expiresIn: '7d' });

    const html = await render(React.createElement(WelcomeEmail, { name: firstName }));
    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Welcome to FAS!',
      html,
    });

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    }));

    return res.status(200).json({
      token,
      user: {
        _id: newCustomer._id,
        email,
        firstName,
        lastName,
        _type: 'customer',
        userRole: 'customer',
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Registration error:', err.message);
    } else {
      console.error('❌ Registration error:', err);
    }
    return res.status(500).json({ message: 'Registration failed' });
  }
}