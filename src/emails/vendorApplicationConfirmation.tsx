import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';

export default function VendorApplicationConfirmationEmail({ name, applicationDate }: { name: string; applicationDate: string | Date }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Thanks for applying to be a vendor at FAS Motorsports – we’re reviewing your application</Preview>
      <Body style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111', padding: '40px', borderRadius: '8px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://www.fasmotorsports.com/images/faslogochroma.png"
              alt="FAS Motorsports Logo"
              style={{ maxWidth: '180px', display: 'block', margin: '0 auto' }}
            />
          </Section>
          <Section>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15' }}>
              Thank you for applying, {name}!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              We’ve received your vendor application <p><strong>Application Date:</strong> {new Date(applicationDate).toLocaleDateString()}</p> and our team will review it promptly.
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              You can expect to hear back from us within 48 business hours. If approved, you’ll receive an email with further onboarding steps to access your vendor dashboard and begin offering your products or services through FAS Motorsports.
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              If you have any questions in the meantime, feel free to reach out to us at{' '}
              <Link href="mailto:support@fasmotorsports.com" style={{ color: '#facc15' }}>
                support@fasmotorsports.com
              </Link>.
            </Text>
            <Text style={{ fontSize: '16px', marginTop: '24px' }}>
              Best regards,<br />
              The FAS Motorsports Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}