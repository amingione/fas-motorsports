import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '../../emails/WelcomeEmail';
import React from 'react';

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
  const { email, password, firstName, lastName } = req.body;
  console.log('📥 Received register payload:', { email, password: !!password, firstName, lastName });

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await client.fetch(`*[_type == "customer" && email == $email][0]`, { email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = {
      _type: 'customer',
      email,
      firstName,
      lastName,
      passwordHash,
    };

    const newCustomer = await client.create(customer);
    const token = jwt.sign({ _id: newCustomer._id }, JWT_SECRET, { expiresIn: '7d' });

    const html = await render(React.createElement(WelcomeEmail, { name: firstName }));
    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Welcome to FAS!',
      html,
    });

    return res.status(200).json({
      token,
      user: {
        email,
        firstName,
        lastName,
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