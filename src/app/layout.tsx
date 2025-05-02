import React from 'react';
import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './global.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'F.A.S. Motorsports',
  description: 'Login or sign up to manage your FAS Motorsports orders.',
  icons: {
    icon: '/images/RedFASChromeLogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}