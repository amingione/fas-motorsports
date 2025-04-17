import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-12">
      <SignedIn>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl text-primary font-borg tracking-wider">F.a.S.</h1><h1 className="text-4xl text-white font-ethno tracking-wider">Motorsports</h1>
          <p className="text-lg font-light text-gray-300">
            Welcome back! Below you'll find your recent orders, saved quotes, and current builds.
          </p>
          <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
            <h2 className="text-xl font-kwajong text-white mb-4">Your Orders</h2>
            <p className="text-sm text-gray-400">Order history and status will display here once we connect your data from Sanity.</p>
          </div>
          <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
            <h2 className="text-xl font-kwajong text-white mb-4">Saved Quotes</h2>
            <p className="text-sm text-gray-400">You haven’t saved any quotes yet. Start building one through the FAS garage.</p>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <p className="mb-4 text-white text-lg">You're not signed in.</p>
          <SignInButton />
        </div>
      </SignedOut>
    </div>
  )
}