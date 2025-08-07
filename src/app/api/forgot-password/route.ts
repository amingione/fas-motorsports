import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import PasswordResetEmail from '@/emails/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = 'no-reply@updates.fasmotorsports.com';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

    // Simulate password reset logic (replace with actual user lookup)
    const resetLink = `https://fasmotorsports.io/reset-password?token=12345`;
  
    // Return a simple response for now
    return NextResponse.json({ message: 'Password reset link generated', resetLink });
  }