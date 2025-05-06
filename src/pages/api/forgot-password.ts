import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import React from 'react';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    }

    const customer = await sanity.fetch(`*[_type == "customer" && email == $email][0]`, { email });

    if (!customer) {
      return NextResponse.json({ message: 'No account found with that email' }, { status: 404 });
    }

    const token = jwt.sign({ _id: customer._id }, JWT_SECRET, { expiresIn: '15m' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4321';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const html = await render(
      React.createElement(PasswordResetEmail, { name: customer.firstName, resetLink })
    );

    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@updates.fasmotorsports.com>',
      to: email,
      subject: 'Reset Your Password',
      html,
    });

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Password reset email error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}