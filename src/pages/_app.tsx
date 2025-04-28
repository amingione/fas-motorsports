import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'; // optional: if you want custom Clerk theming
import '@/app/global.css';
import '@/app/theme-fas.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{ baseTheme: dark }} // Optional Clerk dark mode or custom theme
    >
      <Head>
        <title>FAS Motorsports</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/New Red FAS Logo.png" />
      </Head>

      {/* Hide Dashboard Button while already on Dashboard */}
      {pathname !== '/dashboard' && (
        <div className="absolute top-16 left-4 z-50">
          <Link
            href="/dashboard"
            className="px-8 py-4 border font-ethno border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
          >
            Dashboard
          </Link>
        </div>
      )}

      <main className="min-h-screen bg-black text-white font-captain">
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
}