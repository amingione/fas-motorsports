import React from 'react';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export default function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#FF0000', textAlign: 'center' }}>FAS Motorsports Password Reset</h1>
      <p>Hi {name},</p>
      <p>To reset your password, click the link below:</p>
      <a href={resetLink} style={{ color: '#0070f3', textDecoration: 'none' }}>
        Reset Password
      </a>
      <p>If you didn’t request this, ignore this email.</p>
      <p>Best,<br />FAS Motorsports Team</p>
    </div>
  );
}