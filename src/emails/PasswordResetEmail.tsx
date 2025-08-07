import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  email: string;
  name: string;
  status: string;
}

interface Order {
  orderId: string;
  status: string;
  amount: number;
  orderDate: string;
}

interface DashboardData {
  user: User;
  orders: Order[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    console.log('Local Storage Token:', token);
    if (!token) {
      router.push('/sign-in');
      return;
    }

    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log('API Response Status:', res.status);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setDashboardData(data as DashboardData))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]); // Include router in dependency array

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={() => router.push('/sign-in')}>Log In</button></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {dashboardData && (
        <div>
          <h2 className="text-xl mb-2">Welcome, {dashboardData.user.name}</h2>
          <p>Email: {dashboardData.user.email}</p>
          <p>Status: {dashboardData.user.status}</p>
          <h3 className="text-lg mt-4 mb-2">Orders</h3>
          {dashboardData.orders.length > 0 ? (
            <ul className="list-disc pl-5">
              {dashboardData.orders.map((order) => (
                <li key={order.orderId}>
                  Order #{order.orderId}: {order.status} (Total: ${order.amount}), Date: {new Date(order.orderDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
}