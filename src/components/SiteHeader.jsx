"use client";
import { useState } from 'react';
import Link from 'next/link';
import { services } from '../data/services';
import { site } from '../data/site';

const navLinks = [
  { href: '/services/', label: 'Services' },
  { href: '/painters-fleming-island-fl/', label: 'Fleming Island' },
  { href: '/contact/', label: 'Contact' },
];

const PhoneIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Sticky header for every page except the homepage, which has its own hero nav.
// quoteHref lets a page with an on-page form point the button at it.
export default function SiteHeader({ quoteHref = '/contact/' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/10 text-left">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label={`${site.name} home`}>
          <img
            src="/images/LED-logo-128.webp"
            srcSet="/images/LED-logo-128.webp 1x, /images/LED-logo-320.webp 2.5x"
            alt=""
            width="64"
            height="64"
            className="h-14 w-14 lg:h-16 lg:w-16"
          />
          <span className="hidden sm:block font-serif-luxury font-bold text-lg text-[--luxury-champagne] leading-tight">
            {site.shortName}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-8 font-sans-luxury font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-200 hover:text-white no-underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-[--luxury-champagne] hover:text-white no-underline font-sans-luxury font-semibold"
          >
            <PhoneIcon />
            <span className="hidden md:inline">{site.phone}</span>
            <span className="sr-only md:hidden">Call {site.phone}</span>
          </a>
          <a
            href={quoteHref}
            className="hidden sm:inline-flex items-center rounded-full bg-[--luxury-champagne] px-5 py-2.5 font-sans-luxury font-semibold text-[--luxury-midnight] hover:bg-white no-underline"
          >
            Free Quote
          </a>
          <button
            type="button"
            className="lg:hidden p-2 text-slate-200 hover:text-white bg-transparent border-0"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="site-menu" aria-label="Mobile" className="lg:hidden border-t border-white/10 px-4 pb-6 pt-2 font-sans-luxury">
          <ul className="list-none m-0 p-0 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-3 text-lg text-white no-underline" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Services</p>
          <ul className="list-none m-0 p-0 grid grid-cols-2 gap-x-4">
            {services.map((svc) => (
              <li key={svc.slug}>
                <Link href={`/services/${svc.slug}/`} className="block py-2 text-slate-200 no-underline" onClick={() => setOpen(false)}>
                  {svc.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
