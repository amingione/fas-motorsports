"use client";
import './global.css';
import './theme-fas.css';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <Head>
        <title>FAS Motorsports</title>
        <meta name="description" content="High-performance parts, tuning, and custom builds." />
      </Head>
      <header className="absolute top-4 right-6 flex space-x-4 z-50">
        {!isLoggedIn && (
          <>
            <Link
              href="/sign-in"
              className="text-white font-ethno text-sm hover:text-primary transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-white font-ethno text-sm hover:text-primary transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </header>
      <main
        className="min-h-screen flex items-center justify-center bg-fit text-white px-4"
        style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-primary font-borg text-2xl sm:text-3xl md:text-4xl tracking-[.3em] drop-shadow-md">
            F.a.S.
          </h1>
          <h1 className="text-white font-ethno text-2xl sm:text-3xl md:text-4xl tracking-[.3em] drop-shadow-md">
            Motorsports
          </h1>
          <Link
            href="/dashboard"
            className="px-6 py-3 text-white bg-primary hover:bg-white hover:text-primary border-2 border-primary rounded-md font-kwajong tracking-widest transition-all duration-300 shadow-lg"
          >
            GO TO DASHBOARD
          </Link>
        </div>
      </main>
    </>
  );
}
