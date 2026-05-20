import Link from 'next/link';
import Contact from '../../src/components/Contact';
import Footer from '../../src/components/Footer';
import Breadcrumbs from '../../src/components/Breadcrumbs';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://ledcustompainting.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Contact',
      item: 'https://ledcustompainting.com/contact/',
    },
  ],
};

export const metadata = {
  title: 'Get a Free Painting Quote | LED Custom Painting Jacksonville FL',
  description: 'Request a free, no-obligation painting quote from LED Custom Painting. Professional interior, exterior, and commercial painting services in Jacksonville & North Florida. Call (904) 385-0426.',
  alternates: {
    canonical: '/contact/',
  },
  openGraph: {
    type: 'website',
    title: 'Get a Free Painting Quote | LED Custom Painting Jacksonville FL',
    description: 'Request a free, no-obligation painting quote. Professional painting services in Jacksonville & North Florida. Licensed, insured, 3-year warranty.',
    url: 'https://ledcustompainting.com/contact/',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
        </div>
      </div>

      <Contact />

      {/* Service area map & business hours */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans-luxury text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Find Us
            </p>
            <div className="mx-auto mt-3 h-px w-12 bg-slate-300" />
            <h2 className="mt-5 font-serif-luxury font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">
              Serving Jacksonville &amp; North Florida
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            {/* Map */}
            <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-slate-200 shadow-lg min-h-[340px]">
              <iframe
                title="Map of the LED Custom Painting service area in Jacksonville, North Florida"
                src="https://www.google.com/maps?q=Jacksonville,FL&z=10&output=embed"
                className="w-full h-full min-h-[340px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Hours & contact */}
            <div className="lg:col-span-2 rounded-2xl bg-[--luxury-midnight] p-8 text-left flex flex-col">
              <h3 className="font-serif-luxury text-2xl text-[--luxury-champagne] mb-6">
                Business Hours
              </h3>
              <ul className="space-y-2 font-sans-luxury text-slate-300 list-none p-0 m-0">
                <li className="flex justify-between gap-4 border-b border-slate-700/50 pb-2">
                  <span>Monday – Friday</span>
                  <span className="text-[--luxury-champagne]">8:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-slate-700/50 pb-2">
                  <span>Saturday</span>
                  <span className="text-[--luxury-champagne]">9:00 AM – 4:00 PM</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sunday</span>
                  <span className="text-slate-400">Closed</span>
                </li>
              </ul>

              <div className="mt-7 pt-6 border-t border-slate-700/50 space-y-2">
                <p className="font-sans-luxury text-sm text-slate-400">Call or email</p>
                <a
                  href="tel:+19043850426"
                  className="block font-serif-luxury text-xl text-[--luxury-champagne] hover:text-white transition-colors no-underline"
                >
                  (904) 385-0426
                </a>
                <a
                  href="mailto:info@ledcustompainting.com"
                  className="block font-sans-luxury text-slate-300 hover:text-[--luxury-champagne] transition-colors no-underline"
                >
                  info@ledcustompainting.com
                </a>
              </div>

              <p className="mt-7 pt-6 border-t border-slate-700/50 font-sans-luxury text-sm text-slate-400 leading-relaxed">
                Proudly serving Jacksonville, Fleming Island, Orange Park, Middleburg,
                Green Cove Springs, and communities across Clay &amp; Duval counties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
