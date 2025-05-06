import '../app/global.css';
import '../app/theme-fas.css';
import 'nprogress/nprogress.css'; // Import nprogress styles

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import { ErrorBoundary } from 'react-error-boundary';

// Optional error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800 border border-red-400">
      <p><strong>Something went wrong:</strong></p>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>FAS Motorsports</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/FASRedLogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="description" content="Performance automotive products and services" />
        <meta property="og:title" content="FAS Motorsports" />
        <meta property="og:image" content="/images/FASRedLogo.png" />
        <meta property="og:description" content="Performance automotive products and services" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}