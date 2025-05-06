import * as React from 'react';

const logo = 'https://www.fasmotorsports.com/images/faslogochroma.png';

export function PasswordResetEmail({ name, resetLink }: { name: string; resetLink: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#111', color: '#fff', padding: '40px', margin: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="FAS Motorsports Logo" style={{ maxWidth: '160px', display: 'block', margin: '0 auto' }} />
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <h1 style={{ color: '#facc15' }}>Reset Your Password</h1>
          <p>Hello {name || 'there'},</p>
          <p>We received a request to reset your FAS Motorsports account password.</p>
          <p>Click the button below to proceed. The link will expire in 15 minutes:</p>
          <p style={{ marginTop: '32px', textAlign: 'center' }}>
            <a
              href={resetLink}
              style={{
                backgroundColor: '#facc15',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Reset Password
            </a>
          </p>
          <p style={{ marginTop: '24px' }}>
            If you didn’t request a password reset, no action is needed. Your account remains secure.
          </p>
          <p style={{ fontSize: '12px', marginTop: '40px', color: '#888' }}>
            This message was sent by FAS Motorsports. Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  );
}