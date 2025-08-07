import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  console.log('Received token:', token);
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    console.log('Verifying with JWT_SECRET:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    console.log('Decoded token:', decoded);
    if (!decoded || !decoded._id) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    console.log('Fetching user with _id:', decoded._id);
    const user = await sanity.fetch(
      `*[_type == "customer" && _id == $id][0] {
        _id,
        email,
        firstName,
        lastName
      }`,
      { id: decoded._id }
    );

    if (!user) {
      console.log('User not found for _id:', decoded._id);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Fetching orders for customerId:', decoded._id);
    const orders = await sanity.fetch(
      `*[_type == "order" && customer._ref == $customerId] {
        _id,
        orderDate,
        total,
        items[] {
          product->title,
          quantity
        }
      }`,
      { customerId: decoded._id }
    );

    return NextResponse.json({ user, orders }, { status: 200 });
  } catch (err) {
    console.error('API /me error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}