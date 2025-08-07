import React from 'react';

interface VendorApplicationConfirmationProps {
  name: string;
  applicationDate: string;
}

export default function VendorApplicationConfirmation({
  name,
  applicationDate,
}: VendorApplicationConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#FF0000', textAlign: 'center' }}>FAS Motorsports Vendor Application Confirmation</h1>
      <p>Dear {name},</p>
      <p>Thank you for applying to become a vendor with FAS Motorsports. Your application has been received.</p>
      <p><strong>Application Date:</strong> {new Date(applicationDate).toLocaleDateString()}</p>
      <p>Our sales team will review your application and contact you within 48 hours. If you have any questions, feel free to reach out.</p>
      <p>Best regards,<br />FAS Motorsports Team</p>
      {/* Remove <img> or replace with <Image> if needed */}
    </div>
  );
}