import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';
import { renderToStaticMarkup } from 'react-dom/server';
import PasswordResetEmail from '@/emails/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = 'no-reply@updates.fasmotorsports.com';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  // Simulate password reset logic (replace with actual user lookup from Sanity)
  const resetLink = `https://fasmotorsports.io/reset-password?token=12345`; // Placeholder token
  const name = 'User'; // Replace with actual user name from Sanity

  const html = renderToStaticMarkup(PasswordResetEmail({ name, resetLink }));
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'FAS Motorsports Password Reset',
    html,
  });

  return NextResponse.json({ message: 'Password reset email sent' });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}