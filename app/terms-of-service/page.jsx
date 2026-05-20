import Link from 'next/link';
import Footer from '../../src/components/Footer';

export const metadata = {
  title: 'Terms of Service | LED Custom Painting Jacksonville FL',
  description: 'Terms governing the use of ledcustompainting.com and quote requests submitted through this site.',
  alternates: {
    canonical: '/terms-of-service/',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Terms of Service | LED Custom Painting Jacksonville FL',
    description: 'Terms governing the use of ledcustompainting.com and quote requests submitted through this site.',
    url: 'https://ledcustompainting.com/terms-of-service/',
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
};

const LAST_UPDATED = 'April 27, 2026';

export default function TermsOfServicePage() {
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
            Terms of Service
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
            <strong className="font-semibold">Notice:</strong> These Terms of Service are a working document and are being formalized. They do not replace the terms of any signed estimate, contract, or work order between you and LED Custom Painting &amp; More. Questions? Contact{' '}
            <a href="mailto:info@ledcustompainting.com" className="underline hover:text-amber-950">
              info@ledcustompainting.com
            </a>
            .
          </div>

          <p className="mb-8">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of ledcustompainting.com (the &ldquo;Site&rdquo;), operated by LED Custom Painting &amp; More (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Use of the Site
          </h2>
          <p className="mb-6">
            The Site is provided for general informational purposes about our painting and property services. You agree to use the Site only for lawful purposes and in a way that does not infringe on the rights of others or restrict their use of the Site.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Quote Requests &amp; Communications
          </h2>
          <p className="mb-6">
            Submitting a quote request through the Site or contacting us by phone or email is an inquiry, not a binding agreement. Any project we perform for you is governed by a separate written estimate, contract, or work order signed by both parties. Pricing, scope, timelines, and warranty terms are defined in that signed agreement and not by content displayed on the Site.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Intellectual Property
          </h2>
          <p className="mb-6">
            All content on the Site &mdash; including text, graphics, logos, photographs of completed projects, and the &ldquo;LED Custom Painting&rdquo; name and marks &mdash; is owned by or licensed to LED Custom Painting &amp; More and is protected by U.S. copyright and trademark laws. You may not reproduce, distribute, or create derivative works from this content without our prior written permission.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Third-Party Links
          </h2>
          <p className="mb-6">
            The Site may link to third-party websites (for example, our social media profiles or external review platforms). We are not responsible for the content, privacy practices, or terms of those sites. You access them at your own risk.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Disclaimer of Warranties
          </h2>
          <p className="mb-6">
            The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components. Service-specific warranties (for example, our 3-year workmanship warranty) are defined in the written estimate or contract for your project, not on the Site.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Limitation of Liability
          </h2>
          <p className="mb-6">
            To the fullest extent permitted by law, LED Custom Painting &amp; More is not liable for any indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Site. Our total liability for any claim arising out of your use of the Site is limited to one hundred U.S. dollars (US$100).
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Governing Law
          </h2>
          <p className="mb-6">
            These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles. Any dispute arising from your use of the Site shall be brought in the state or federal courts located in Duval County, Florida, and you consent to the jurisdiction of those courts.
          </p>

          <h2 className="font-serif-luxury text-2xl text-[--luxury-midnight] mt-10 mb-4">
            Changes to These Terms
          </h2>
          <p className="mb-6">
            We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page indicates when it was most recently revised. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.
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
