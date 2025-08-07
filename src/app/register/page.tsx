'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Register response status:', res.status);
      const data = await res.json();
      console.log('Register response data:', data);
      if (res.ok) {
        window.location.href = '/sign-in'; // Redirect to sign-in on success
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Failed to connect to server');
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-fit text-white px-4" style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
      <div className="bg-black p-6 rounded-lg shadow-lg border border-white max-w-md w-full text-center">
        <div className="mb-6">
          <Image
            src="/images/RedFASChromeLogo.png"
            alt="FAS Motorsports Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-ethno font-bold text-red-600 mb-6 uppercase">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-ethno mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-white font-ethno mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200 font-ethno uppercase tracking-wide"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
        <div className="text-center mt-6 text-white text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-yellow-300 hover:underline">
              Sign in here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}