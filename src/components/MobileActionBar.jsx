"use client";
import { useEffect, useState } from 'react';
import { site } from '../data/site';

// Fixed call / quote bar on phones. Points the quote button at the form on
// the current page when there is one, otherwise at the contact page.
export default function MobileActionBar() {
  const [quoteHref, setQuoteHref] = useState('/contact/');

  useEffect(() => {
    if (document.getElementById('quote')) setQuoteHref('#quote');
  }, []);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] pb-[env(safe-area-inset-bottom)] bg-slate-900">
      <a
        href={site.phoneHref}
        className="flex items-center justify-center gap-2 py-4 bg-[--luxury-midnight] text-[--luxury-champagne] font-sans-luxury font-semibold no-underline"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call Now
      </a>
      <a
        href={quoteHref}
        className="flex items-center justify-center py-4 bg-[--luxury-champagne] text-[--luxury-midnight] font-sans-luxury font-semibold no-underline"
      >
        Free Quote
      </a>
    </div>
  );
}
