import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  interface Order {
    _id: string;
    title: string;
    status: string;
  }

  interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    quotes?: {
      quoteId: string;
      status: string;
      dateRequested: string;
      notes?: string;
    }[];
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [quotes, setQuotes] = useState<User['quotes']>([] as User['quotes']);

  useEffect(() => {
    async function fetchUserAndOrders() {
      try {
        const meRes = await fetch('https://fasmotorsports.io/api/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!meRes.ok) return;

        const { user } = await meRes.json();
        setUser(user);

        const res = await fetch('https://fasmotorsports.io/api/userData', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        setOrders(data.orders || []);
        setQuotes(data.quotes || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchUserAndOrders();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fit text-white px-4"
      style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {user ? (
          <>
            <h1 className="text-4xl text-primary font-borg tracking-wider">F.a.S.</h1>
            <h1 className="text-4xl text-white font-ethno tracking-wider">Motorsports</h1>
            <p className="text-lg font-light text-gray-300">
              Welcome back, {user.firstName || user.email}! Below you&apos;ll find your recent orders, saved quotes, and current builds.
            </p>

            {/* Orders Section */}
            <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
              <h2 className="text-xl font-kwajong text-white mb-4">Your Orders</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-400">No orders yet.</p>
              ) : (
                <ul className="text-sm text-gray-300 space-y-2">
                  {orders.map(order => (
                    <li key={order._id}>
                      {order.title} — {order.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Saved Quotes Section */}
            <div className="border border-white/10 rounded-lg p-6 bg-white/5 shadow-md">
              <h2 className="text-xl font-kwajong text-white mb-4">Saved Quotes</h2>
              {quotes?.length === 0 ? (
                <p className="text-sm text-gray-400">
                  You haven&apos;t saved any quotes yet. Start building one through the FAS garage.
                </p>
              ) : (
                <ul className="text-sm text-gray-300 space-y-2">
                  {quotes?.map(quote => (
                    <li key={quote.quoteId}>
                      Quote #{quote.quoteId} — {quote.status} ({new Date(quote.dateRequested).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please sign in to view your dashboard</h1>
            <Link href="/sign-in" className="text-blue-500 underline">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
}