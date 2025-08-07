import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received sign-in request:', body);
  const { email, password } = body;
  if (email === 'test@example.com' && password === 'password') {
    console.log('Generating token with JWT_SECRET:', JWT_SECRET);
    const token = jwt.sign({ _id: '0ZX8N1zyCF6xa6AD272tW' }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token);
    return NextResponse.json({ token });
  }
  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}