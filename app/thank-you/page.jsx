import { Suspense } from 'react';
import SiteHeader from '../../src/components/SiteHeader';
import Footer from '../../src/components/Footer';
import ThankYou from '../../src/components/ThankYou';

// Where both forms land after sending. Kept out of search results; GA4 can
// count its page views as a lead (Admin > Key events).
export const metadata = {
  title: 'Thank You | LED Custom Painting',
  description: 'We got your request and will be in touch soon.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/thank-you/' },
};

export default function ThankYouPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <ThankYou />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
