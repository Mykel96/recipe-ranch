"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export default function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-brown-700" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full mb-8 border border-white/20">
          <ChefHat size={36} className="text-white" />
        </div>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          {t("cta.heading1")}
          <br />
          <span className="font-[family-name:var(--font-accent)] font-normal text-golden-200">
            {t("cta.heading2")}
          </span>
        </h2>

        <p className="font-[family-name:var(--font-body)] text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("cta.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-cream text-terracotta-600 font-bold text-lg rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl group"
            >
              {t("cta.cta1")}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white/80 text-white font-bold text-lg rounded-full transition-all duration-200 hover:-translate-y-1"
          >
            {t("cta.cta2")}
          </Link>
        </div>

        {/* Trust note */}
        <p className="font-[family-name:var(--font-body)] text-sm text-white/50 mt-8">
          {t("cta.trust")}
        </p>
      </div>
    </section>
  );
}
