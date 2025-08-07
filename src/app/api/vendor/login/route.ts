import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { sanityClient } from '@/lib/sanity';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received vendor login request:', body);
  const { email, password } = body;

  const vendor = await sanityClient.fetch(
    `*[_type == "vendor" && email == $email && status == "Approved"][0]`,
    { email }
  );
  if (!vendor) {
    return NextResponse.json({ message: 'Vendor not found or not approved' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, vendor.passwordHash);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ _id: vendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: '1h' });
  console.log('Generated vendor token:', token);
  return NextResponse.json({ token });
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