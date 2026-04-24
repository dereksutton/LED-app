"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";

const ServiceFAQ = ({ faqs, title }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,230,211,0.08),transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title={title}
          subtitle="Quick answers to the most common questions we hear. Not seeing yours? Give us a call at (904) 385-0426."
          variant="dark"
          align="center"
          className="mb-12"
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-slate-600/30 bg-slate-800/50 backdrop-blur-sm shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans-luxury font-semibold text-white hover:bg-white/5 transition-colors border-none"
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <motion.svg
                  className="h-5 w-5 flex-shrink-0 text-[--luxury-rose-gold]"
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
