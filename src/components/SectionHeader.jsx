"use client";

import { motion } from "framer-motion";

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  variant = "light",
  align = "center",
  className = "",
}) => {
  const isCenter = align === "center";
  const alignWrap = isCenter ? "text-center" : "text-left";
  const dividerAlign = isCenter ? "mx-auto" : "";
  const subtitleAlign = isCenter ? "mx-auto" : "";

  const eyebrowColor =
    variant === "dark" ? "text-[--luxury-rose-gold]" : "text-amber-700";
  const titleColor =
    variant === "dark" ? "text-[--luxury-champagne]" : "text-slate-900";
  const subtitleColor =
    variant === "dark" ? "text-slate-300" : "text-slate-600";
  const dividerColor =
    variant === "dark" ? "bg-[--luxury-champagne]/40" : "bg-slate-300";

  return (
    <motion.div
      className={`${alignWrap} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <>
          <p
            className={`font-sans-luxury text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
          <div className={`mt-3 h-px w-12 ${dividerColor} ${dividerAlign}`} />
        </>
      )}
      <h2
        className={`${eyebrow ? "mt-5" : ""} font-serif-luxury font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 font-sans-luxury text-base md:text-lg leading-relaxed ${subtitleColor} max-w-2xl ${subtitleAlign}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
