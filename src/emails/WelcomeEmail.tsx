import * as React from 'react';

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Welcome to FAS Motorsports</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#111', color: '#fff', padding: '40px', margin: 0 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <img
            src="https://www.fasmotorsports.com/images/faslogochroma.png"
            alt="FAS Motorsports Logo"
            style={{ display: 'block', margin: '0 auto 20px', maxWidth: '180px' }}
          />
          <h1 style={{ color: '#ea1d26' }}>Welcome to FAS Motorsports</h1>
          <p>Hello {name || 'there'},</p>
          <p>Thanks for joining the FAS Motorsports community. Your account is now active!</p>
          <p>You can now save builds, track orders, and request custom quotes directly from your dashboard.</p>
          <p style={{ marginTop: '32px', textAlign: 'center' }}>
            <a
              href="https://fasmotorsports.com/dashboard"
              style={{
                backgroundColor: '#ea1d26',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
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