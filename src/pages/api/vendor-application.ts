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
  } = req.body;

  // Clean inputs
  const sanitized = {
    businessName: businessName.toString().trim(),
    contactName: contactName.toString().trim(),
    email: email.toString().trim().toLowerCase(),
    phone: phone.toString().trim(),
    businessType: businessType.toString().trim(),
    message: message.toString().trim(),
  };

  // Email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email);

  if (!sanitized.businessName) {
    return res.status(400).json({ message: 'Business name is required' });
  }

  if (!sanitized.contactName) {
    return res.status(400).json({ message: 'Contact name is required' });
  }

  if (!isValidEmail) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  if (!sanitized.phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const existing = await client.fetch(
      `*[_type == "vendorApplication" && email == $email][0]`,
      { email: sanitized.email }
    );

    if (existing) {
      return res.status(409).json({ message: 'A vendor with this email has already applied' });
    }

    const doc = {
      _type: 'vendorApplication',
      ...sanitized,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      approved: false
    };

    await client.create(doc);

    try {
      await resend.emails.send({
        from: 'FAS Motorsports <no-reply@updates.fasmotorsports.io>',
        to: sanitized.email,
        subject: 'Vendor Application Received',
        react: VendorApplicationConfirmation({ name: sanitized.businessName }),
      });
    } catch (emailErr) {
      console.error('Error sending confirmation email:', emailErr);
    }

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Vendor application error:', err, 'Request Body:', req.body);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
