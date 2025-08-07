'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Order {
  orderId: string;
  status: string;
  amount: number;
  orderDate: string;
}

interface Quote {
  quoteId: string;
  status: string;
  dateSubmitted: string;
  description: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    if (token) {
      fetch('/api/vendor/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
          setQuotes(data.quotes || []);
          setLoading(false);
        })
        .catch(err => console.error('Dashboard fetch error:', err));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
    >
      <div className="bg-black p-6 rounded-lg shadow-lg border border-white max-w-4xl w-full text-white">
        <div className="mb-6">
          <Image
            src="/images/FASRedLogo.png"
            alt="FAS Motorsports Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-orbitron font-bold text-red-600 mb-6 uppercase">
          Vendor Dashboard
        </h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Orders</h2>
            {orders.length > 0 ? (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.orderId} className="p-4 bg-gray-800 rounded-lg">
                    Order #{order.orderId}: {order.status} (Total: ${order.amount}), Date: {new Date(order.orderDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders yet.</p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Quotes</h2>
            {quotes.length > 0 ? (
              <ul className="space-y-4">
                {quotes.map((quote) => (
                  <li key={quote.quoteId} className="p-4 bg-gray-800 rounded-lg">
                    Quote #{quote.quoteId}: {quote.status}, Submitted: {new Date(quote.dateSubmitted).toLocaleDateString()}, {quote.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quotes submitted.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}