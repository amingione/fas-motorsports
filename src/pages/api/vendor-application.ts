import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/sanityClient';
import { Resend } from 'resend';
import VendorApplicationConfirmation from '../../emails/vendorApplicationConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const businessName = req.body.businessName?.trim();
  const contactName = req.body.contactName?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const phone = req.body.phone?.trim();
  const businessType = req.body.businessType?.trim() || '';
  const message = req.body.message?.trim() || '';

  const isValidEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!businessName || !contactName || !isValidEmail || !phone) {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const existing = await client.fetch(`*[_type == "vendorApplication" && email == $email][0]`, { email });

    if (existing) {
      return res.status(409).json({ message: 'A vendor with this email has already applied' });
    }

    const doc = {
      _type: 'vendorApplication',
      businessName,
      contactName,
      email,
      phone,
      businessType,
      message,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      approved: false
    };

    await client.create(doc);

    await resend.emails.send({
      from: 'FAS Motorsports <no-reply@fasmotorsports.io>',
      to: email,
      subject: 'Vendor Application Received',
      react: VendorApplicationConfirmation({ name: businessName }),
    });

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Vendor application error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
