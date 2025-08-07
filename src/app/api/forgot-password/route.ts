import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import PasswordResetEmail from '../../../emails/PasswordResetEmail';
import React from 'react';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);
const JWT_SECRET = process.env.JWT_SECRET || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    }

    const customer = await sanity.fetch(
      `*[_type == "customer" && email == $email][0]`,
      { email }
    );
    if (!customer) {
      return NextResponse.json({ message: 'No account found with that email' }, { status: 404 });
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign({ _id: customer._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${BASE_URL}/reset-password?token=${token}`;

    const html = await render(React.createElement(PasswordResetEmail, { name: customer.firstName, resetLink }));
    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Reset Your Password',
      html,
    });

    return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
  } catch (err) {
    console.error('Forgot password error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }

  
}