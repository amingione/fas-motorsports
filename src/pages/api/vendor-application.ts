import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/sanityClient';
import { Resend } from 'resend';
import VendorApplicationConfirmation from '../../emails/vendorApplicationConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    businessName = '',
    contactName = '',
    email = '',
    phone = '',
    businessType = '',
    message = ''
  } = req.body || {};

  const sanitized = {
    businessName: String(businessName).trim(),
    contactName: String(contactName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    businessType: String(businessType).trim(),
    message: String(message).trim(),
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email);

  if (!sanitized.businessName) return res.status(400).json({ message: 'Business name is required' });
  if (!sanitized.contactName) return res.status(400).json({ message: 'Contact name is required' });
  if (!isValidEmail) return res.status(400).json({ message: 'A valid email is required' });
  if (!sanitized.phone) return res.status(400).json({ message: 'Phone number is required' });

  try {
    const existing = await client.fetch(
      `*[_type == "vendorApplication" && email == $email][0]`,
      { email: sanitized.email }
    );

    if (existing) {
      return res.status(409).json({ message: 'A vendor with this email has already applied' });
    }

    const newDoc = {
      _type: 'vendorApplication',
      ...sanitized,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      approved: false
    };

    await client.create(newDoc);

    try {
      await resend.emails.send({
        from: 'FAS Motorsports <no-reply@updates.fasmotorsports.io>',
        to: sanitized.email,
        subject: 'Vendor Application Received',
        react: VendorApplicationConfirmation({ name: sanitized.businessName }),
      });
    } catch (emailErr) {
      console.error('[Email Error] Failed to send vendor confirmation:', emailErr);
      // We don't block submission on email failure
    }

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('[Vendor Application Error]:', err, 'Payload:', req.body);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
