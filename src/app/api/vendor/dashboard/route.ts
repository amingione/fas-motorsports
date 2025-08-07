import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  console.log('Received vendor dashboard request with token:', token);
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string, role: string };
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    // Simulate fetching orders (replace with Sanity query)
    const orders = [{ id: '1', product: 'Part A', price: 100 }, { id: '2', product: 'Part B', price: 150 }];
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}