import Link from 'next/link';
import { services } from '../../src/data/services';
import Footer from '../../src/components/Footer';
import CTABanner from '../../src/components/CTABanner';

export const metadata = {
  title: 'Painting Services Jacksonville FL | LED Custom Painting',
  description: 'Professional painting services in Jacksonville & North Florida. Interior, exterior, pressure washing, cabinet refinishing, ceiling services, and commercial painting. Free quotes.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    type: 'website',
    title: 'Painting Services Jacksonville FL | LED Custom Painting',
    description: 'Professional painting services in Jacksonville & North Florida. Interior, exterior, pressure washing, cabinet refinishing, ceiling services, and commercial painting.',
    url: 'https://ledcustompainting.com/services',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LED Custom Painting Services in Jacksonville FL',
      },
    ],
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
};

export default function ServicesIndex() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight] py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Back link */}
          <div className="mb-8">
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
          <h1 className="font-serif-luxury text-4xl lg:text-6xl text-[--luxury-champagne] mb-6">
            Our Services
          </h1>
          <p className="font-sans-luxury text-xl text-slate-300 max-w-3xl mx-auto">
            Professional painting and property services throughout Jacksonville and North Florida. Licensed, insured, and backed by a 3-year warranty.
          </p>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent" />

      {/* Services Grid */}
      <main className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="group relative block overflow-hidden rounded-2xl border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[--luxury-champagne]/50 hover:scale-[1.02] min-h-[320px] no-underline"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-black/55 transition-all duration-300 group-hover:from-black/45 group-hover:via-black/30 group-hover:to-black/45" />

                <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-8">
                  <h2 className="text-2xl font-serif-luxury font-bold text-white mb-2">
                    {service.name}
                  </h2>
                  <p className="text-sm font-sans-luxury text-gray-200 leading-relaxed mb-4 line-clamp-2">
                    {service.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-sans-luxury font-semibold text-[--luxury-midnight] bg-[--luxury-champagne]/90 rounded-full px-4 py-1.5 self-start transition-colors group-hover:bg-[--luxury-champagne]">
                    Learn More
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
