"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CTABanner = ({ heading = "Ready to Get Started?", subheading = "Get a free, no-obligation quote for your project today." }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.08),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 px-6 py-12 text-center md:flex-row md:px-8 md:text-left"
      >
        <div>
          <p className="text-xl mb-1 font-serif-luxury font-semibold text-[--luxury-champagne]">
            {heading}
          </p>
          <p className="text-base font-sans-luxury text-slate-300">
            {subheading}
          </p>
        </div>
        <Link
          href="/#quote"
          className="inline-flex h-14 animate-shimmer items-center justify-center rounded-full border border-[--luxury-champagne]/30
            bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-10 font-serif-luxury font-semibold text-white text-lg tracking-wide whitespace-nowrap
            transition-all duration-500 ease-out transform hover:-translate-y-1 hover:scale-105
            shadow-2xl hover:shadow-[--luxury-champagne]/20 backdrop-blur-sm no-underline"
        >
          Get Your Free Quote
        </Link>
      </motion.div>
    </section>
  );
};

export default CTABanner;
