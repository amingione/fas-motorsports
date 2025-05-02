import * as React from 'react';

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#111', color: '#fff', padding: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <img
            src="/images/RedFASChromeLogo.png"
            alt="FAS Motorsports Logo"
            style={{ display: 'block', margin: '0 auto 20px', maxWidth: '180px' }}
          />
          <h1 style={{ color: '#ea1d26' }}>Welcome to FAS Motorsports</h1>
          <p>Hello {name || 'there'},</p>
          <p>Thank you for creating an account with FAS Motorsports. We&apos;re pumped to have you as part of our performance community.</p>
          <p>You can now view orders, save builds, and request quotes through your dashboard.</p>
          <p style={{ marginTop: '32px' }}>
            <a href="https://fasmotorsports.com/dashboard" style={{ background: '#ea1d26', color: '#fff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none' }}>
              Go to Your Dashboard
            </a>
          </p>
          <p style={{ fontSize: '12px', marginTop: '40px', color: '#888' }}>
            This message was sent by FAS Motorsports. Please do not reply directly to this email.
          </p>
        </div>
      </body>
    </html>
  );
}