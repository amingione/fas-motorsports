'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function VendorApplicationPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
    resaleCertificateId: '',
    taxId: '',
    businessAddress: '',
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    const trimmedData = {
      businessName: formData.businessName.trim(),
      contactName: formData.contactName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      businessType: formData.businessType.trim(),
      message: formData.message.trim(),
      resaleCertificateId: formData.resaleCertificateId.trim(),
      taxId: formData.taxId.trim(),
      businessAddress: formData.businessAddress.trim(),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\-\+]{9,15}$/;

    if (
      !trimmedData.businessName ||
      !trimmedData.contactName ||
      !trimmedData.email ||
      !trimmedData.phone ||
      !trimmedData.resaleCertificateId ||
      !trimmedData.taxId ||
      !trimmedData.businessAddress
    ) {
      setStatus('❌ Please fill out all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(trimmedData.email)) {
      setStatus('❌ Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(trimmedData.phone)) {
      setStatus('❌ Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/vendor-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedData),
      });

      if (res.ok) {
        setApplicationSubmitted(true);
      } else if (res.status === 409) {
        setStatus('❌ A vendor with this email already applied.');
      } else {
        setStatus(`❌ Something went wrong: ${res.statusText}`);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setStatus('❌ Network error — please check your connection and try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover text-white px-4"
      style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
    >
      {applicationSubmitted ? (
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-red-600">Application Received</h1>
          <p className="text-lg">Thank you for your interest in becoming a vendor with FAS Motorsports.</p>
          <p className="text-md text-gray-300">Our sales team will review your application and reach out within 48 hours.</p>
        </div>
      ) : (
        <div>
          <h1 className="relative text-2xl mt-10 text-white font-bold">
            <span className="text-red-600">F.a.S.</span> Motorsports
          </h1>
          <h2 className="text-2xl font-bold mt-2 text-red-600">Vendor Application</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-black/30 p-6 border border-white mt-6 max-w-xl mx-auto rounded-lg"
          >
            <input
              type="text"
              name="businessName"
              placeholder="Company Name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              name="contactName"
              placeholder="Main Contact Person"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              name="businessType"
              placeholder="Business Type"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              name="resaleCertificateId"
              placeholder="Resale Certificate ID"
              value={formData.resaleCertificateId}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              name="taxId"
              placeholder="Tax ID (EIN)"
              value={formData.taxId}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              name="businessAddress"
              placeholder="Business Address"
              value={formData.businessAddress}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <textarea
              name="message"
              placeholder="Additional Information"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              rows={4}
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200 font-bold disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            {status && (
              <p
                className={`text-sm mt-2 ${
                  status.startsWith('✅') ? 'text-green-600 font-semibold' : status.startsWith('❌') ? 'text-red-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}