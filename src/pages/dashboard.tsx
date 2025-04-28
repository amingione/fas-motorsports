import { SignedIn, SignedOut, useUser, SignInButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  interface Order {
    _id: string;
    title: string;
    status: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);

  const { user } = useUser();

  useEffect(() => {
    async function syncAndFetchOrders() {
      if (!user) return;

      await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });

      const res = await fetch('/api/userData');
      const data = await res.json();
      setOrders(data.orders);
    }

    syncAndFetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-cover bg-center text-white px-6 py-12" style={{ backgroundImage: "url('/images/about page background FAS.png')" }}>
      <div className="max-w-4xl mx-auto space-y-6">

        <SignedIn>
          {/* Logged in content */}
          <h1 className="text-4xl text-primary font-borg tracking-wider">F.a.S.</h1>
          <h1 className="text-4xl text-white font-ethno tracking-wider">Motorsports</h1>
          <p className="text-lg font-light text-gray-300">
            Welcome back! Below you&apos;ll find your recent orders, saved quotes, and current builds.
          </p>

          <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
            <h2 className="text-xl font-kwajong text-white mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-400">No orders yet.</p>
            ) : (
              <ul className="text-sm text-gray-300 space-y-2">
                {orders.map(order => (
                  <li key={order._id}>{order.title} - {order.status}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
            <h2 className="text-xl font-kwajong text-white mb-4">Saved Quotes</h2>
            <p className="text-sm text-gray-400">You haven&apos;t saved any quotes yet. Start building one through the FAS garage.</p>
          </div>
        </SignedIn>

        <SignedOut>
          {/* Visitor / not logged in */}
          <h1 className="text-3xl font-bold mb-4">Please sign in to view your dashboard</h1>
          <SignInButton />
        </SignedOut>

      </div>
    </div>
  );
}