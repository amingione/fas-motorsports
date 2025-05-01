import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Name fields cannot be empty.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center text-white px-4" style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
      <form
      onSubmit={handleRegister}
       className="bg-black text-white border border-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-6 ring-1 ring-red-700/30"
      >
        <h1 className="text-primary font-captain text-xl sm:text-lg tracking-widest mb-4 text-center">
          Create Account
        </h1>

        <div className="space-y-2">
          <label className="text-white text-sm uppercase tracking-wider">First Name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required autoComplete="given-name" className="w-full bg-black border border-white px-4 py-2 rounded" />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm uppercase tracking-wider">Last Name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required autoComplete="family-name" className="w-full bg-black border border-white px-4 py-2 rounded" />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm uppercase tracking-wider">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="w-full bg-black border border-white px-4 py-2 rounded" />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm uppercase tracking-wider">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" className="w-full bg-black border border-white px-4 py-2 rounded" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn btn-primary font-ethno tracking-wide px-6 py-3 rounded-md shadow-md w-full">
          Register
        </button>

        <p className="text-white text-sm text-center">
          Already have an account? <a href="/sign-in" className="text-accent underline">Log in here</a>.
        </p>
      </form>
    </div>
  );
}