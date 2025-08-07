import { useState, useEffect } from 'react';

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

  async function fetchUserAndOrders() {
    const token = localStorage.getItem('token') || '';
    console.log('Local Storage Token:', token);
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    try {
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response Status:', meRes.status);
      if (!meRes.ok) {
        const errorText = await meRes.text();
        throw new Error(`API error: ${meRes.status} - ${errorText || 'Unknown error'}`);
      }
      const data = await meRes.json();
      return data as DashboardData;
    } catch (err) {
      console.error('Failed to fetch user and orders:', err instanceof Error ? err.message : err);
      throw err;
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchUserAndOrders()
      .then(data => setDashboardData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // Empty dependency array for mount-only effect

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={() => window.location.href = '/sign-in'}>Log In</button></div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {dashboardData && (
        <div>
          <h2>Welcome, {dashboardData.user.firstName} {dashboardData.user.lastName}</h2>
          <h3>Orders</h3>
          {dashboardData.orders.length > 0 ? (
            <ul>
              {dashboardData.orders.map(order => (
                <li key={order._id}>
                  Order #{order._id} - {new Date(order.orderDate).toLocaleDateString()} - Total: ${order.total}
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