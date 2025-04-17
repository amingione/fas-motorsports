import {
  ClerkProvider
} from '@clerk/nextjs'
import '@/app/global.css'
import '@/app/theme-fas.css'
import Head from 'next/head'
import type { AppProps } from 'next/app';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Head>
        <link rel="icon" href="/images/New Red FAS Logo.png" />
      </Head>
      <div className="absolute top-16 left-4 z-50">
        <Link
          href="/dashboard"
          className="px-8 py-4 border font-ethno border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
        >
          Dashboard
        </Link>
      </div>
      <main className="min-h-screen bg-black text-white font-captain">
        <header className="p-4 flex justify-end space-x-4"></header>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  )
}