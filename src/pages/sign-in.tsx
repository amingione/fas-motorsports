import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Defensive: check content-type before parsing as JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected server response. Please try again later.');
      }
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError(data.message || 'Invalid credentials. Please try again.');
          return;
        }
        throw new Error(data.message || 'Login failed. Please try again later.');
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center text-white px-4"
      style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-black text-white border border-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h1 className="text-primary font-captain text-2xl sm:text-xl tracking-widest mb-4">
          Sign In
        </h1>

        <div className="space-y-2">
          <label className="block text-white font-bold uppercase text-sm tracking-wider">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            className="w-full bg-black text-white border border-white focus:ring-primary px-4 py-2 rounded transition duration-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white font-bold uppercase text-sm tracking-wider">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="w-full bg-black text-white border border-white focus:ring-primary px-4 py-2 rounded transition duration-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-primary hover:bg-white text-white hover:text-black font-ethno tracking-wider px-6 py-3 rounded-md transition duration-300 shadow-md w-full"
        >
          Log In
        </button>

        <p className="text-white mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-accent underline">Register here</a>.
        </p>
        <p className="text-white text-sm text-center">
          <a href="/forgot-password" className="text-accent underline">Forgot your password?</a>
        </p>
      </form>
    </div>
  );
}