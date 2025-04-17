import {
  ClerkProvider
} from '@clerk/nextjs'
import '@/app/global.css'
import '@/app/theme-fas.css'
import Head from 'next/head'

export default function App({ Component, pageProps }: any) {
  return (
    <ClerkProvider>
      <Head>
        <link rel="icon" href="/images/New Red FAS Logo.png" />
        <a
          href="/dashboard"
          className="absolute top-15 left-4 px-8 py-4 border font-ethno border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
        >
          Dashboard
        </a>
      </Head>
      <main className="min-h-screen bg-black text-white font-captain">
        <header className="p-4 flex justify-end space-x-4"></header>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  )
}