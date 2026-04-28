import Link from 'next/link';
import Footer from '../../src/components/Footer';

export const metadata = {
  title: 'Privacy Policy | LED Custom Painting Jacksonville FL',
  description: 'How LED Custom Painting & More collects, uses, and protects information you share through ledcustompainting.com.',
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Privacy Policy | LED Custom Painting Jacksonville FL',
    description: 'How LED Custom Painting & More collects, uses, and protects information you share through ledcustompainting.com.',
    url: 'https://ledcustompainting.com/privacy-policy',
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
};

const LAST_UPDATED = 'April 27, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Top nav */}
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

      {/* Hero header */}
      <header className="relative bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight] py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.08),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-sans-luxury text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[--luxury-rose-gold] mb-4">
            Legal
          </p>
          <div className="mx-auto h-px w-12 bg-[--luxury-champagne]/40 mb-6" />
          <h1 className="font-serif-luxury font-bold text-4xl md:text-5xl text-[--luxury-champagne] tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 font-sans-luxury text-sm text-slate-400">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent" />

      {/* Main content */}
      <main className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-24">
        <article className="max-w-3xl mx-auto px-6 lg:px-8 text-left font-sans-luxury text-slate-700 leading-relaxed">
          <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <strong className="font-semibold">Notice:</strong> This privacy policy is a working document and is being formalized. The summary below reflects how we currently handle information collected through this website. For any privacy questions in the meantime, contact us at{' '}
            <a href="mailto:info@ledcustompainting.com" className="underline hover:text-amber-950">
              info@ledcustompainting.com
            </a>
            .
          </div>

          <p className="mb-8">
            LED Custom Painting &amp; More (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates ledcustompainting.com (the &ldquo;Site&rdquo;). This Privacy Policy explains what information we collect from visitors, how we use it, and the choices you have. By using the Site, you agree to the practices described below.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you voluntarily provide and a limited amount of technical information about your visit:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Quote &amp; contact form data:</strong> name, email address, phone number, project address or service area, and any project details you submit through forms on the Site or via email or phone.
            </li>
            <li>
              <strong>Analytics data:</strong> standard Google Analytics measurements such as pages viewed, approximate location (city level), referring site, device type, and browser. This data is used in aggregate to understand site performance.
            </li>
            <li>
              <strong>Cookies &amp; similar technologies:</strong> small files placed on your device by Google Analytics and, if and when we run advertising, by Google Ads and Meta (Facebook) advertising tools.
            </li>
          </ul>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To respond to your quote request, schedule estimates, and communicate about projects.</li>
            <li>To follow up on completed projects for warranty support and customer satisfaction.</li>
            <li>To improve the Site and our services using aggregated, anonymized analytics.</li>
            <li>To comply with legal obligations and protect our rights.</li>
          </ul>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            How We Share Your Information
          </h2>
          <p className="mb-6">
            We do not sell, rent, or trade your personal information. We share information only with: (a) service providers we use to operate the business (for example, email and analytics tools); (b) subcontractors directly involved in completing your project, when needed; and (c) authorities or counsel if required by law.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Cookies &amp; Analytics
          </h2>
          <p className="mb-6">
            The Site uses Google Analytics to measure traffic. You can opt out of Google Analytics with the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[--luxury-midnight] underline hover:text-slate-900">
              Google Analytics Opt-Out Browser Add-on
            </a>
            . Most browsers also let you block or delete cookies in their settings.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Your Rights &amp; Choices
          </h2>
          <p className="mb-6">
            You may request a copy of personal information we hold about you, ask us to correct it, or ask us to delete it, by contacting{' '}
            <a href="mailto:info@ledcustompainting.com" className="text-[--luxury-midnight] underline hover:text-slate-900">
              info@ledcustompainting.com
            </a>
            . We will respond within a reasonable timeframe.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="mb-6">
            The Site is not directed to children under 13, and we do not knowingly collect personal information from children. If you believe a child has provided us information, please contact us so we can remove it.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Changes to This Policy
          </h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page indicates when it was most recently revised. Material changes will be reflected here.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Contact Us
          </h2>
          <p className="mb-6">
            LED Custom Painting &amp; More
            <br />
            Jacksonville, FL
            <br />
            Email:{' '}
            <a href="mailto:info@ledcustompainting.com" className="text-[--luxury-midnight] underline hover:text-slate-900">
              info@ledcustompainting.com
            </a>
            <br />
            Phone:{' '}
            <a href="tel:+19043850426" className="text-[--luxury-midnight] underline hover:text-slate-900">
              (904) 385-0426
            </a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
