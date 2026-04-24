import Link from 'next/link';
import Contact from '../../src/components/Contact';
import Footer from '../../src/components/Footer';

export const metadata = {
  title: 'Get a Free Painting Quote | LED Custom Painting Jacksonville FL',
  description: 'Request a free, no-obligation painting quote from LED Custom Painting. Professional interior, exterior, and commercial painting services in Jacksonville & North Florida. Call (904) 385-0426.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    title: 'Get a Free Painting Quote | LED Custom Painting Jacksonville FL',
    description: 'Request a free, no-obligation painting quote. Professional painting services in Jacksonville & North Florida. Licensed, insured, 3-year warranty.',
    url: 'https://ledcustompainting.com/contact',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Get a free quote from LED Custom Painting',
      },
    ],
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get a Free Painting Quote | LED Custom Painting Jacksonville FL',
    description: 'Request a free, no-obligation painting quote. Professional painting services in Jacksonville & North Florida.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'Get a free quote from LED Custom Painting',
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Simple nav bar */}
      <div className="bg-[--luxury-midnight] py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white font-sans-luxury text-sm hover:bg-white/20 transition-all no-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <Contact />
      <Footer />
    </div>
  );
}
