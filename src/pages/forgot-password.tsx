import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const data = text ? JSON.parse(text) : { message: 'Server error' };
          throw new Error(data.message || 'Failed to send reset email');
        } catch (parseError) {
          throw new Error('Server returned invalid response');
        }
      }

      const data = await res.json();
      setMessage('Reset link sent! Please check your email.');
      setEmail('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fit text-white px-4" style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h1 className="text-xl font-bold text-center text-primary uppercase tracking-wide">Forgot Password</h1>

        <div className="space-y-2">
          <label htmlFor="emailInput" className="text-white text-sm uppercase tracking-wider">Email</label>
          <input
            id="emailInput"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-black text-white border border-white px-4 py-2 rounded"
          />
        </div>

        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-white text-white hover:text-black font-bold px-6 py-3 rounded-md transition duration-300 w-full"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}