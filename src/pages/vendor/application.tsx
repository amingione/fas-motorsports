import { useState } from 'react';

export default function VendorApplicationPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
    resaleId: '',
    website: '',
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
      resaleId: formData.resaleId.trim(),
      website: formData.website.trim(),
      taxId: formData.taxId.trim(),
      businessAddress: formData.businessAddress.trim(),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\-\+]{9,15}$/;

    if (!trimmedData.businessName || !trimmedData.contactName || !trimmedData.email || !trimmedData.phone || !trimmedData.resaleId || !trimmedData.taxId || !trimmedData.businessAddress) {
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
      setStatus('❌ Something went wrong. Please try again later.');
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-fit bg-center text-white px-4"
      style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
    >
      {applicationSubmitted ? (
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h1 className="text-3xl font-borg text-primary">Application Received</h1>
          <p className="text-lg">Thank you for your interest in becoming a vendor with FAS Motorsports.</p>
          <p className="text-md text-gray-300">Our sales team will review your application and reach out within 48 hours.</p>
        </div>
      ) : (
        <div>
          <h1 className="relative text-2xl text-primary font-borg mb-6">Vendor Application</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="businessName" aria-label="Business Name" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required className="w-full p-2 border-black/50 bg-black/40 rounded" />
            <input type="text" name="contactName" aria-label="Contact Name" placeholder="Contact Name" value={formData.contactName} onChange={handleChange} required className="w-full bg-black/40 p-2 border-black/50 rounded" />
            <input type="email" name="email" aria-label="Email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full bg-black/40 p-2 border-black/50 rounded" />
            <input type="tel" name="phone" aria-label="Phone Number" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full bg-black/40 p-2 border-black/50 rounded" />
            <input type="text" name="businessType" aria-label="Business Type" placeholder="Business Type" value={formData.businessType} onChange={handleChange} className="w-full bg-black/40 p-2 border-black/50 rounded" />
            <input type="text" name="resaleId" aria-label="Resale Certificate ID" placeholder="Resale Certificate ID" value={formData.resaleId} onChange={handleChange} required className="w-full p-2 border-black/50 bg-black/40 rounded" />
            <input type="text" name="taxId" aria-label="Tax ID (EIN)" placeholder="Tax ID (EIN)" value={formData.taxId} onChange={handleChange} required className="w-full p-2 border-black/50 bg-black/40 rounded" />
            <input type="text" name="website" aria-label="Business Website" placeholder="Business Website" value={formData.website} onChange={handleChange} className="w-full p-2 border-black/50 bg-black/40 rounded" />
            <input type="text" name="businessAddress" aria-label="Business Address" placeholder="Business Address" value={formData.businessAddress} onChange={handleChange} required className="w-full p-2 border-black/50 bg-black/40 rounded" />
            <textarea name="message" aria-label="Additional Information" placeholder="Additional Information" value={formData.message} onChange={handleChange} className="w-full p-2 border-black/50 bg-black/40 rounded" rows={4}></textarea>
            <button
              type="submit"
              className="text-primary font-cyber px-4 py-2 rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            {status && <p className={`text-sm mt-2 ${status.startsWith('✅') ? 'text-green-600 font-semibold' : status.startsWith('❌') ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>{status}</p>}
          </form>
        </div>
      )}
    </div>
  );
}