import * as React from 'react';
import logo from '../../images/FASRedLogo.png';

export function PasswordResetEmail({ name, resetLink }: { name: string; resetLink: string }) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#111', color: '#fff', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo.src} alt="FAS Motorsports Logo" style={{ maxWidth: '160px' }} />
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <h1 style={{ color: '#e11d48' }}>Reset Your Password</h1>
          <p>Hello {name || 'there'},</p>
          <p>We received a request to reset your password for your FAS Motorsports account.</p>
          <p>Click the button below to reset it. This link will expire in 15 minutes.</p>
          <p style={{ marginTop: '32px' }}>
            <a href={resetLink} style={{ background: '#e11d48', color: '#fff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none' }}>
              Reset Password
            </a>
          </p>
          <p style={{ marginTop: '24px' }}>
            If you didn’t request this, you can safely ignore this email.
          </p>
          <p style={{ fontSize: '12px', marginTop: '40px', color: '#888' }}>
            This message was sent by FAS Motorsports. Do not reply directly to this email.
          </p>
        </div>
      </body>
    </html>
  );
}