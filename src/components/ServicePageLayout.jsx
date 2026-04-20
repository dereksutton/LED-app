"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "./Hero";
import Footer from "./Footer";
import ServiceFAQ from "./ServiceFAQ";
import CTABanner from "./CTABanner";

const ServicePageLayout = ({
  service,
  relatedServices = [],
}) => {
  return (
    <div className="overflow-x-hidden">
      {/* Service Hero */}
      <header className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Nav back link */}
        <div className="absolute top-6 left-6 z-20">
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

        {/* Hero text */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-luxury font-bold text-white max-w-4xl leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {service.tagline}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-[--luxury-champagne] font-sans-luxury max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Professional {service.name} in Jacksonville &amp; North Florida
          </motion.p>
        </div>
      </header>

      {/* Decorative divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent" />

      <main>
        {/* Description Section */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif-luxury text-3xl lg:text-4xl text-slate-800 mb-8">
                {service.name} in Jacksonville, FL
              </h2>
              {service.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="font-sans-luxury text-lg text-slate-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif-luxury text-3xl lg:text-4xl text-[--luxury-champagne] mb-10 text-center">
                Why Choose LED for {service.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[--luxury-champagne]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[--luxury-champagne]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-sans-luxury text-slate-200">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        {service.faqs && service.faqs.length > 0 && (
          <ServiceFAQ
            faqs={service.faqs}
            title={`${service.name} Questions`}
          />
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="font-serif-luxury text-2xl md:text-3xl text-slate-800 text-center">
                  Explore Our Other Services
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((svc) => (
                  <motion.div
                    key={svc.slug}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                  >
                    <Link
                      href={`/services/${svc.slug}/`}
                      className="group relative block overflow-hidden rounded-2xl border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[--luxury-champagne]/50 hover:scale-[1.02] min-h-[260px] no-underline"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${svc.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-black/50 transition-all duration-300 group-hover:from-black/45 group-hover:via-black/30 group-hover:to-black/40" />

                      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-6">
                        <h3 className="text-xl font-serif-luxury font-bold text-white mb-2">
                          {svc.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-sm font-sans-luxury font-semibold text-[--luxury-midnight] bg-[--luxury-champagne]/90 rounded-full px-4 py-1.5 self-start transition-colors group-hover:bg-[--luxury-champagne]">
                          Learn More
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
};

export default ServicePageLayout;
