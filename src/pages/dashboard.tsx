import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Order {
  _id: string;
  orderDate: string;
  total: number;
  items: { product: { title: string }; quantity: number }[];
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

  async function fetchUserAndOrders() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    try {
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!meRes.ok) {
        const errorText = await meRes.text();
        throw new Error(`API error: ${meRes.status} - ${errorText || 'Unknown error'}`);
      }

      const data = await meRes.json();
      return data as DashboardData;
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchUserAndOrders()
      .then(data => setDashboardData(data))
      .catch(err => {
        setError(err.message);
        setTimeout(() => router.push('/sign-in'), 4000);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white px-4"
        style={{
          backgroundImage: "url('/images/about page background FAS.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center"
        style={{
          backgroundImage: "url('/images/about page background FAS.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2>Please sign in to view your dashboard</h2>
        <a
          href="/sign-in"
          style={{
            color: '#4ea5ff',
            textDecoration: 'underline',
            marginTop: '1rem',
            display: 'inline-block',
          }}
        >
          Log in
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2rem',
        color: 'white',
        minHeight: '100vh',
        backgroundImage: "url('/images/about page background FAS.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1>Dashboard</h1>
      {dashboardData && (
        <div>
          <h2>
            Welcome, {dashboardData.user.firstName} {dashboardData.user.lastName}
          </h2>
          <h3>Orders</h3>
          {dashboardData.orders.length > 0 ? (
            <ul>
              {dashboardData.orders.map(order => (
                <li key={order._id}>
                  Order #{order._id} - {new Date(order.orderDate).toLocaleDateString()} - Total: $
                  {order.total}
                  <ul>
                    {order.items.map(item => (
                      <li key={item.product.title}>
                        {item.product.title} x {item.quantity}
                      </li>
                    ))}
                  </ul>
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