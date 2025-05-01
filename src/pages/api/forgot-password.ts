import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import React from 'react';
import jwt from 'jsonwebtoken';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);
const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const customer = await sanity.fetch(`*[_type == "customer" && email == $email][0]`, { email });

  if (!customer) return res.status(404).json({ message: 'No account found with that email' });

  const token = jwt.sign({ _id: customer._id }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `https://fasmotorsports.io/reset-password?token=${token}`;

  try {
    const html = await render(React.createElement(PasswordResetEmail, { name: customer.firstName, resetLink }));
    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Reset Your Password',
      html,
    });

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (err: any) {
    console.error('Password reset email error:', err.message);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}