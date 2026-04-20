"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ServiceFAQ = ({ faqs, title }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,230,211,0.08),transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 md:px-8">
        {/* Section header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E8B4A0]">
            FAQ
          </p>
          <div className="mx-auto mt-2 h-px w-12 bg-[--luxury-champagne]/30" />
          <h2 className="mt-4 text-3xl md:text-4xl font-serif-luxury font-bold tracking-tight text-[--luxury-champagne]">
            {title}
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-slate-600/30 bg-slate-800/50 backdrop-blur-sm shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans-luxury font-semibold text-white hover:bg-white/5 transition-colors border-none"
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <motion.svg
                  className="h-5 w-5 flex-shrink-0 text-[#E8B4A0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-4 font-sans-luxury text-slate-300 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
