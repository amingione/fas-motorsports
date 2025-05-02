'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = router.query

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Missing or invalid token.')
      return
    }

    if (password !== confirm) {
      setError("Passwords don\u2019t match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed.')

      setMessage('Password successfully reset! Redirecting to sign-in...')
      setPassword('')
      setConfirm('')

      setTimeout(() => {
        router.push('/sign-in')
      }, 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fit text-white px-4"style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
      <form onSubmit={handleReset} className="bg-zinc-900 border border-white max-w-md w-full p-8 rounded-lg shadow-md">
        <input
          type="text"
          name="username"
          autoComplete="username"
          className="hidden"
          tabIndex={-1}
        />
        <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>

        <label htmlFor="password" className="block mb-1 text-sm">New Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full p-2 mb-4 rounded bg-zinc-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmPassword" className="block mb-1 text-sm">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full p-2 mb-4 rounded bg-zinc-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold rounded ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white transition`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {message && <p className="text-green-500 mt-4 text-sm">{message}</p>}
      </form>
    </div>
  )
}