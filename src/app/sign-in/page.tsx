'use client';

import React, { useState } from 'react';

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

      const data = await res.json();
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
      <div className="min-h-screen flex items-center justify-center bg-fit text-white px-4" style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
    <div style={{
        backgroundColor: 'black',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #fff',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 0 15px rgba(255, 0, 0, 0.2)'
      }}>
        <h1 style={{
          color: 'red',
          fontFamily: 'ethnocentric',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>
          Sign In
        </h1>

        <form onSubmit={handleSubmit}>
          <label style={{ color: 'white', fontWeight: 'bold', fontFamily: 'cyber princess' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#111',
              border: '1px solid #444',
              borderRadius: '4px',
              color: 'white',
              fontFamily: 'bold'
            }}
          />

          <label style={{ color: 'white', fontWeight: 'bold', fontFamily: 'cyber princess' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#111',
              border: '1px solid #444',
              borderRadius: '4px',
              color: 'white',
              fontFamily: 'bold'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '10px',
              cursor: 'pointer',
              fontFamily: 'ethnocentric'
            }}
          >
            Log In
          </button>

          {error && (
            <p style={{ color: 'red', marginTop: '1rem', font: 'ethnocentric'}}>{error}</p>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'white', fontSize: '0.9rem' }}>
          <p>
            Don’t have an account?{' '}
            <a href="/register" style={{ color: '#f5c469' }}>Register here.</a>
          </p>
          <p>
            <a href="/vendor/apply" style={{ color: '#f5c469' }}>Apply to be a vendor</a>
          </p>
          <p>
            <a href="/forgot-password" style={{ color: '#f5c469' }}>Forgot your password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}