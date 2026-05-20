import Link from 'next/link';
import { services } from '../../src/data/services';
import Footer from '../../src/components/Footer';
import CTABanner from '../../src/components/CTABanner';
import Breadcrumbs from '../../src/components/Breadcrumbs';

export const metadata = {
  title: 'Painting Services in Jacksonville, FL | LED Custom Painting',
  description:
    'Professional painting services in Jacksonville & North Florida — interior, exterior, cabinet, ceiling & commercial painting plus pressure washing. Free quotes.',
  alternates: {
    canonical: '/services/',
  },
  openGraph: {
    type: 'website',
    title: 'Painting Services in Jacksonville, FL | LED Custom Painting',
    description:
      'Professional painting services in Jacksonville & North Florida — interior, exterior, cabinet, ceiling & commercial painting plus pressure washing.',
    url: 'https://ledcustompainting.com/services/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LED Custom Painting services in Jacksonville, FL',
      },
    ],
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Painting Services in Jacksonville, FL | LED Custom Painting',
    description:
      'Interior, exterior, cabinet, ceiling & commercial painting plus pressure washing across Jacksonville & North Florida.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'LED Custom Painting services in Jacksonville, FL',
      },
    ],
  },
};

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
      name: 'Services',
      item: 'https://ledcustompainting.com/services/',
    },
  ],
};

export default function ServicesIndex() {
  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight] py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Back link */}
          <div className="mb-8 flex justify-center">
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
          <p className="font-sans-luxury text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[--luxury-rose-gold] mb-4">
            Our Services
          </p>
          <div className="mx-auto h-px w-12 bg-[--luxury-champagne]/40 mb-6" />
          <h1 className="font-serif-luxury font-bold text-4xl md:text-5xl lg:text-6xl text-[--luxury-champagne] tracking-tight leading-tight">
            Professional Painting &amp; Property Services
          </h1>
          <p className="mt-6 font-sans-luxury text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Throughout Jacksonville and North Florida. Licensed, insured, and backed by a 3-year warranty — from single-room refreshes to full commercial buildouts.
          </p>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Services' }]} />
        </div>
      </div>

      {/* Services Grid */}
      <main className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-sans-luxury text-lg text-slate-600 leading-relaxed">
              LED Custom Painting &amp; More brings 13+ years of professional painting
              experience to homeowners and businesses across Jacksonville,{' '}
              <Link
                href="/painters-fleming-island-fl/"
                className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-800 transition-colors"
              >
                Fleming Island
              </Link>
              , and North Florida. Every service below is handled by licensed, insured
              crews, finished with premium Sherwin-Williams and Benjamin Moore coatings,
              and backed by our written 3-year warranty. Choose a service to see our
              process, what is included, and answers to common questions — then request a
              free, no-obligation quote.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="group relative block overflow-hidden rounded-2xl border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[--luxury-champagne]/60 hover:-translate-y-1 min-h-[360px] no-underline"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

                <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end p-8">
                  <h2 className="text-2xl font-serif-luxury font-bold text-white mb-3 tracking-tight">
                    {service.name}
                  </h2>
                  <p className="text-sm font-sans-luxury text-slate-200 leading-relaxed mb-5 line-clamp-2">
                    {service.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-sans-luxury font-semibold text-[--luxury-midnight] bg-[--luxury-champagne] rounded-full px-5 py-2 self-start shadow-lg shadow-black/30 ring-1 ring-[--luxury-champagne]/60 transition-transform duration-300 group-hover:translate-x-0.5">
                    Learn More
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <CTABanner />
      <Footer />
    </div>
  );
}
