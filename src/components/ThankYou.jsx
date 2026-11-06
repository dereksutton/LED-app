"use client";
import Link from 'next/link';
import { site } from '../data/site';
import TextUsLink from './TextUsLink';

// The message after a quote request. The same for everyone: whether a job
// is in the service area is the owner's call, made later.
export default function ThankYou() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center lg:py-28">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-serif-luxury text-4xl text-[#2C3E50] lg:text-5xl">
        Thanks, we got your request
      </h1>
      <p className="mt-6 font-sans-luxury text-lg text-slate-600">
        We’ll call or text within one business day to set up your free estimate.
      </p>
      <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-left font-sans-luxury text-slate-700">
        <p className="font-semibold text-[#2C3E50]">What happens next</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>We reach out to ask a few questions about the project.</li>
          <li>We set a time to come take a look. The estimate is free.</li>
          <li>You get a written quote you can accept online.</li>
        </ol>
      </div>
      <p className="mt-10 font-sans-luxury text-slate-600">Need us sooner?</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a href={site.phoneHref} className="inline-flex items-center rounded-full bg-[#2C3E50] px-6 py-3 font-sans-luxury font-semibold text-[#F5E6D3] no-underline hover:bg-[#1e293b]">
          Call {site.phone}
        </a>
        <TextUsLink className="inline-flex items-center rounded-full border-2 border-[#2C3E50] px-6 py-3 font-sans-luxury font-semibold text-[#2C3E50] no-underline hover:bg-slate-50">
          Text us
        </TextUsLink>
      </div>
      <p className="mt-10">
        <Link href="/" className="font-sans-luxury text-sm text-slate-500">Back to the home page</Link>
      </p>
    </section>
  );
}
