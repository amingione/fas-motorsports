import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === 'test@example.com' && password === 'password') {
    const token = jwt.sign({ _id: '0ZX8N1zyCF6xa6AD272tW' }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
  }
  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}