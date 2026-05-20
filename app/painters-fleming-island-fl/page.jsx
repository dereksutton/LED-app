import Link from 'next/link';
import { services } from '../../src/data/services';
import Footer from '../../src/components/Footer';
import CTABanner from '../../src/components/CTABanner';
import SectionHeader from '../../src/components/SectionHeader';
import Breadcrumbs from '../../src/components/Breadcrumbs';

export const metadata = {
  title: 'Fleming Island Painting Contractors | LED Custom Painting',
  description:
    'Looking for painting contractors in Fleming Island, FL? LED Custom Painting offers interior, exterior, cabinet & commercial painting. Free quote today.',
  alternates: {
    canonical: '/painters-fleming-island-fl/',
  },
  openGraph: {
    type: 'website',
    title: 'Fleming Island Painting Contractors | LED Custom Painting',
    description:
      'Licensed & insured painting contractors serving Fleming Island, FL & Clay County. Interior, exterior, cabinet & commercial painting. Free quotes.',
    url: 'https://ledcustompainting.com/painters-fleming-island-fl/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LED Custom Painting — painting contractors in Fleming Island, FL',
      },
    ],
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleming Island Painting Contractors | LED Custom Painting',
    description:
      'Licensed & insured painting contractors serving Fleming Island, FL & Clay County. Free quotes — (904) 385-0426.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'LED Custom Painting — painting contractors in Fleming Island, FL',
      },
    ],
  },
};

const serviceBlurbs = {
  'interior-painting':
    'Refresh bedrooms, living areas, trim, and ceilings with premium, low-VOC finishes.',
  'exterior-painting':
    'Weather-grade coatings that stand up to Fleming Island sun, humidity, and storms.',
  'pressure-washing':
    'Strip away mildew and algae from driveways, siding, lanais, and walkways.',
  'cabinet-refinishing':
    'A factory-smooth kitchen makeover at a fraction of the cost of replacement.',
  'ceiling-services':
    'Popcorn ceiling removal plus smooth and knockdown ceiling finishes.',
  'commercial-painting':
    'Offices, retail, and HOA properties painted on a schedule that fits your business.',
};

const reasons = [
  'Licensed and insured for every Fleming Island project',
  '13+ years painting Clay County homes and businesses',
  'Free, detailed, no-pressure written estimates',
  'Premium Sherwin-Williams and Benjamin Moore coatings',
  '3-year written warranty on all workmanship',
  '5-star rated and respectful of your home',
];

const neighborhoods = [
  'Eagle Harbor',
  'Pace Island',
  'Fleming Island Plantation',
  "Margaret's Walk",
  'Hibernia',
  'Lakeshore',
];

const nearbyAreas = [
  'Orange Park',
  'Middleburg',
  'Green Cove Springs',
  'Doctors Inlet',
  'Oakleaf',
  'Jacksonville',
];

const faqs = [
  {
    q: 'How much does it cost to paint a house in Fleming Island, FL?',
    a: 'Every home is different, so we never give one-size-fits-all pricing. Cost depends on square footage, the number of stories, surface condition, prep work, and the paint grade you choose. The most reliable number is a free on-site estimate — we measure everything, walk the scope with you, and hand you an itemized written quote with no obligation.',
  },
  {
    q: "How long will exterior paint last in Fleming Island's climate?",
    a: 'With proper preparation and quality coatings, a Fleming Island exterior typically holds up for 7 to 10 years. The biggest enemies here are UV exposure, humidity, and wind-driven rain off Doctors Lake and the St. Johns River. We power wash, scrape, sand, caulk, and prime before applying two coats of weather-grade paint — which is what separates a finish that lasts a decade from one that fails in three years.',
  },
  {
    q: 'Do you offer free estimates in Fleming Island?',
    a: 'Yes. Estimates are always free and carry no obligation. We visit your Fleming Island home or business, discuss your goals, assess the surfaces, and send a clear written quote — usually within 24 hours. Call (904) 385-0426 to schedule.',
  },
  {
    q: 'What areas around Fleming Island do you serve?',
    a: 'We are based in the Jacksonville area and cover all of Fleming Island plus the surrounding Clay County communities, including Orange Park, Middleburg, Green Cove Springs, Doctors Inlet, and Oakleaf. If you are nearby and not sure whether we reach you, just call — we will let you know right away.',
  },
];

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
      name: 'Painters in Fleming Island, FL',
      item: 'https://ledcustompainting.com/painters-fleming-island-fl/',
    },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Painting Contractors in Fleming Island, FL',
  serviceType: 'Painting',
  description:
    'Licensed and insured painting contractors serving Fleming Island, FL and Clay County — interior, exterior, cabinet, ceiling, and commercial painting plus pressure washing.',
  provider: { '@id': 'https://ledcustompainting.com/#business' },
  areaServed: { '@type': 'City', name: 'Fleming Island', addressRegion: 'FL' },
  url: 'https://ledcustompainting.com/painters-fleming-island-fl/',
};

export default function FlemingIslandPage() {
  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <header className="relative bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight] py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
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
            Fleming Island, FL
          </p>
          <div className="mx-auto h-px w-12 bg-[--luxury-champagne]/40 mb-6" />
          <h1 className="font-serif-luxury font-bold text-4xl md:text-5xl lg:text-6xl text-[--luxury-champagne] tracking-tight leading-tight">
            Painting Contractors in Fleming Island, FL
          </h1>
          <p className="mt-6 font-sans-luxury text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Licensed, insured, and trusted by Fleming Island homeowners — interior,
            exterior, cabinet, and commercial painting backed by a 3-year written warranty.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="/#quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[--luxury-champagne] px-8 py-3.5 font-sans-luxury font-semibold text-[--luxury-midnight] text-base shadow-xl shadow-black/30 hover:-translate-y-0.5 transition-all no-underline"
            >
              Get a Free Quote
            </a>
            <a
              href="tel:+19043850426"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 font-sans-luxury font-semibold text-white text-base hover:bg-white/20 transition-all no-underline"
            >
              Call (904) 385-0426
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'Painters in Fleming Island, FL' },
            ]}
          />
        </div>
      </div>

      <main>
        {/* Overview */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Overview"
              title="Your Local Fleming Island Painting Team"
              variant="light"
              align="left"
              className="mb-10"
            />
            <div className="space-y-6 font-sans-luxury text-lg text-slate-600 leading-relaxed text-left">
              <p>
                When Fleming Island homeowners search for painting contractors they
                can trust, LED Custom Painting &amp; More is the name they find. For more
                than 13 years we have painted homes and businesses throughout Clay
                County — from the established streets of Eagle Harbor and Pace Island to
                newer construction across Fleming Island and Orange Park. Every project
                is handled by a licensed, insured crew and backed by our written 3-year
                warranty.
              </p>
              <p>
                Fleming Island&apos;s climate is tough on paint. Long, humid summers,
                intense Florida sun, afternoon thunderstorms, and the moisture rolling
                off Doctors Lake and the St. Johns River all work to fade, chalk, and
                peel a finish before its time. We prep and coat every surface
                specifically for these conditions — so your paint job looks sharp for
                years, not months.
              </p>
              <p>
                Whether you need a single room refreshed, your whole exterior repainted,
                kitchen cabinets transformed, or a commercial property maintained, you
                will get the same precision craftsmanship, honest pricing, and
                respectful service that has earned us a 5-star reputation across North
                Florida.
              </p>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Why Choose LED"
              title="Why Fleming Island Homeowners Choose LED"
              subtitle="A local painting contractor with the craftsmanship, coverage, and guarantees to back up every job."
              variant="dark"
              align="center"
              className="mb-14"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30"
                >
                  <div className="w-6 h-6 rounded-full bg-[--luxury-champagne]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[--luxury-champagne]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-sans-luxury text-slate-200 text-left">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Our Services"
              title="Painting Services We Offer in Fleming Island"
              subtitle="Select any service for full details, our step-by-step process, and frequently asked questions."
              variant="light"
              align="center"
              className="mb-14"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}/`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[--luxury-champagne] hover:-translate-y-1 no-underline text-left"
                >
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
                    {service.name} in Fleming Island
                  </h3>
                  <p className="font-sans-luxury text-slate-600 leading-relaxed mb-4">
                    {serviceBlurbs[service.slug]}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans-luxury font-semibold text-amber-700 text-sm group-hover:gap-2.5 transition-all">
                    Learn more
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Local knowledge */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Local Knowledge"
              title="Painting Homes Across Fleming Island"
              variant="dark"
              align="left"
              className="mb-10"
            />
            <div className="space-y-6 font-sans-luxury text-lg text-slate-300 leading-relaxed text-left">
              <p>
                Fleming Island is a community of well-kept, family-focused
                neighborhoods — and each one comes with its own painting needs. We have
                refreshed two-story exteriors in Eagle Harbor, repainted homes around
                Pace Island, updated interiors in Fleming Island Plantation, and
                refinished kitchen cabinets throughout Margaret&apos;s Walk and Hibernia.
              </p>
              <p>
                Because we live and work in North Florida, we understand the details
                that matter here: which sheens hold up to humidity, how to seal stucco
                against moisture, and when to schedule exterior work around the
                afternoon storm season. That local knowledge is the difference between a
                paint job that looks good on day one and one that still looks good years
                later.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {neighborhoods.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 border border-slate-600/40 px-5 py-2.5 font-sans-luxury text-sm text-slate-200"
                >
                  <svg className="w-3.5 h-3.5 text-[--luxury-rose-gold]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Service area */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Service Area"
              title="Beyond Fleming Island"
              subtitle="We also serve the surrounding Clay County and Jacksonville-area communities:"
              variant="light"
              align="center"
              className="mb-10"
            />
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 font-sans-luxury text-sm text-slate-700 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 text-[--luxury-rose-gold]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="FAQ"
              title="Fleming Island Painting — Common Questions"
              variant="dark"
              align="center"
              className="mb-12"
            />
            <div className="space-y-8 text-left">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-serif-luxury text-xl font-bold text-[--luxury-champagne] mb-3">
                    {faq.q}
                  </h3>
                  <p className="font-sans-luxury text-slate-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner
          heading="Ready to Paint Your Fleming Island Home?"
          subheading="Get a free, no-obligation quote from a local, licensed painting contractor."
        />
      </main>

      <Footer />
    </div>
  );
}
