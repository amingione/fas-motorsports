import { NextResponse, NextRequest } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import VendorApplicationConfirmation from '../../../emails/vendorApplicationConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = 'no-reply@updates.fasmotorsports.com';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received vendor application request:', body);
  const {
    email,
    contactPerson,
    phone,
    businessAddress,
    resaleCertificateId,
    taxId,
    businessType,
    website,
    message,
  } = body;

  const existingVendor = await sanityClient.fetch(
    `*[_type == "vendor" && email == $email][0]`,
    { email }
  );
  if (existingVendor) {
    return NextResponse.json({ message: 'A vendor with this email already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash('temp123', 10); // Default password

  const doc = await sanityClient.create({
    _type: 'vendor',
    name: contactPerson,
    email,
    passwordHash,
    phone,
    address: businessAddress,
    notes: message,
    status: 'Pending',
    companyName: body.businessName || '',
    website,
    appliedAt: new Date().toISOString(),
    contactPerson,
    resaleCertificateId,
    taxId,
    businessType,
    yearsInBusiness: 0,
    approved: false,
    active: true,
  });
  console.log('Vendor application submitted:', doc);

  // Send confirmation email
  const html = await render(
    VendorApplicationConfirmation({
      name: contactPerson,
      applicationDate: new Date().toISOString(),
    })
  );
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'FAS Motorsports Vendor Application Confirmation',
    html,
  });

  return NextResponse.json({ message: 'Application received' });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}