import '@/app/global.css';
import '@/app/theme-fas.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const { events } = useRouter();
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
    <>
      <Head>
        <title>FAS Motorsports</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/FASRedLogo.png" />
      </Head>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-red-600 animate-pulse z-50" />
      )}

      <Component {...pageProps} />
    </>
  );
}