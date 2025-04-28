import { ClerkProvider, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import '@/app/global.css';
import '@/app/theme-fas.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  const { pathname, events } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleStop);
    events.on('routeChangeError', handleStop);

    return () => {
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleStop);
      events.off('routeChangeError', handleStop);
    };
  }, [events]);

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Head>
        <title>FAS Motorsports</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/New Red FAS Logo.png" />
      </Head>

      {/* Dashboard or Sign In button (top-left corner) */}
      {pathname !== '/dashboard' && (
        <div className="absolute top-16 left-4 z-50">
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-8 py-4 border font-ethno border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
            >
              Dashboard
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-4 border font-ethno border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      )}

      {/* Loading Spinner Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Page Content with Transition Effects */}
      <main
        className={`min-h-screen bg-black text-white font-captain transition-all duration-500 ease-in-out ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
}