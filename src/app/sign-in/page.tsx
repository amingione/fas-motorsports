'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Sign-in response status:', res.status);
      const data = await res.json();
      console.log('Sign-in response data:', data);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Sign-in failed');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-fas-dark flex items-center justify-center">
      <div className="bg-fas-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <div className="mb-6">
          <Image src="/images/RedFASChromeLogo.png" alt="FAS Motorsports Logo" width={100} height={100} className="mx-auto" />
        </div>
        <h1 className="text-4xl font-orbitron font-bold text-fas-red mb-6 uppercase">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border-2 border-fas-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-fas-red"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border-2 border-fas-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-fas-red"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-fas-red text-white p-3 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Sign In
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}