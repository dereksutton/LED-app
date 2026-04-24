"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "./Footer";
import ServiceFAQ from "./ServiceFAQ";
import CTABanner from "./CTABanner";
import SectionHeader from "./SectionHeader";

const LearnMorePill = () => (
  <span className="inline-flex items-center gap-1.5 text-sm font-sans-luxury font-semibold text-[--luxury-midnight] bg-[--luxury-champagne] rounded-full px-5 py-2 self-start shadow-lg shadow-black/30 ring-1 ring-[--luxury-champagne]/60 transition-transform duration-300 group-hover:translate-x-0.5">
    Learn More
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </span>
);

const ServicePageLayout = ({ service, relatedServices = [] }) => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <header className="relative h-[55vh] min-h-[440px] w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Nav back link */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white font-sans-luxury text-sm hover:bg-white/20 transition-all no-underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.p
            className="font-sans-luxury text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[--luxury-rose-gold] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {service.name}
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-luxury font-bold text-white max-w-4xl leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {service.tagline}
          </motion.h1>
          <motion.p
            className="mt-5 font-sans-luxury text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Professional {service.name.toLowerCase()} in Jacksonville &amp; North Florida — licensed, insured, and backed by a 3-year warranty.
          </motion.p>
          <motion.a
            href="/#quote"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[--luxury-champagne] px-8 py-3.5 font-sans-luxury font-semibold text-[--luxury-midnight] text-base shadow-xl shadow-black/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all no-underline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            Get a Free Quote
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </div>
      </header>

      {/* Decorative divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent" />

      <main>
        {/* Description */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Overview"
              title={`${service.name} in Jacksonville, FL`}
              variant="light"
              align="left"
              className="mb-10"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {service.description.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="font-sans-luxury text-lg text-slate-600 leading-relaxed mb-6 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats band */}
        {service.stats && service.stats.length > 0 && (
          <section className="relative bg-[--luxury-midnight] py-14 border-y border-[--luxury-champagne]/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,230,211,0.06),transparent_60%)]" />
            <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {service.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <p className="font-serif-luxury text-4xl md:text-5xl font-bold text-[--luxury-champagne] tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-2 font-sans-luxury text-xs md:text-sm uppercase tracking-[0.18em] text-slate-400">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Our Process */}
        {service.process && service.process.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <SectionHeader
                eyebrow="Our Process"
                title="How We Deliver Flawless Results"
                subtitle="A transparent, five-step process built around quality, communication, and zero surprises."
                variant="light"
                align="center"
                className="mb-16"
              />
              <ol className="relative space-y-8">
                {service.process.map((step, i) => (
                  <motion.li
                    key={i}
                    className="relative flex flex-col md:flex-row gap-6 md:gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[--luxury-midnight] to-slate-700 text-[--luxury-champagne] font-serif-luxury text-xl font-bold shadow-lg">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif-luxury text-xl md:text-2xl font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="font-sans-luxury text-slate-600 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* What's Included */}
        {service.included && service.included.length > 0 && (
          <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <SectionHeader
                eyebrow="What's Included"
                title={`Everything Your ${service.name} Project Covers`}
                subtitle="No hidden fees, no scope creep — just a clear, itemized scope agreed on before we start."
                variant="dark"
                align="center"
                className="mb-14"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.included.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[--luxury-champagne]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-[--luxury-champagne]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-sans-luxury text-slate-200">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Inspiration Gallery */}
        {service.images && service.images.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <SectionHeader
                eyebrow="Inspiration"
                title={`${service.name} Inspiration`}
                subtitle="Style ideas, color palettes, and finish examples to help you envision what's possible for your space."
                variant="light"
                align="center"
                className="mb-14"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {service.images.map((img, i) => (
                  <motion.div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3] bg-slate-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <img
                      src={img}
                      alt={`${service.name} inspiration — ${i === 0 ? 'style and finish idea' : 'color and design example'}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose LED (Benefits) */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <SectionHeader
              eyebrow="Why Choose LED"
              title={`The LED Custom Painting Advantage`}
              subtitle="Thirteen years of local experience, a 5-star reputation, and a standard of craftsmanship you can see in every brushstroke."
              variant="dark"
              align="center"
              className="mb-14"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="w-6 h-6 rounded-full bg-[--luxury-champagne]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-[--luxury-champagne]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-sans-luxury text-slate-200">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        {service.serviceAreas && service.serviceAreas.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <SectionHeader
                eyebrow="Service Areas"
                title={`${service.name} Across North Florida`}
                subtitle="Based in Jacksonville, proudly serving communities throughout Duval, St. Johns, Clay, and Nassau counties."
                variant="light"
                align="center"
                className="mb-12"
              />
              <motion.div
                className="flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {service.serviceAreas.map((area, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 font-sans-luxury text-sm text-slate-700 shadow-sm hover:shadow-md hover:border-[--luxury-champagne] transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[--luxury-rose-gold]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {area}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {service.faqs && service.faqs.length > 0 && (
          <ServiceFAQ
            faqs={service.faqs}
            title={`${service.name} Questions`}
          />
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <SectionHeader
                eyebrow="Explore More"
                title="Our Other Services"
                variant="light"
                align="center"
                className="mb-14"
              />
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
                      className="group relative block overflow-hidden rounded-2xl border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[--luxury-champagne]/60 hover:-translate-y-1 min-h-[260px] no-underline"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${svc.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-6">
                        <h3 className="text-xl font-serif-luxury font-bold text-white mb-3 tracking-tight">
                          {svc.name}
                        </h3>
                        <LearnMorePill />
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
