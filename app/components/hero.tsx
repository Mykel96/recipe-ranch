"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChefHat, BookOpen, Leaf } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

const PLATE_DURATION = 0.55;
const HEADLINE_DELAY = PLATE_DURATION;
const HEADLINE_DURATION = 0.45;
const TAGLINE_DELAY = HEADLINE_DELAY + 0.3;
const TAGLINE_DURATION = 0.35;
const DECO_DELAY = 0.9;
const DECO_DURATION = 0.35;

const easeOut = "easeOut" as const;

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] overflow-hidden texture-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-parchment to-golden-50" />

      {/* Content - anchored at top, directly under header */}
      <div className="absolute top-16 sm:top-20 left-0 right-0 flex flex-col items-center z-10 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Badge - fades in with headline */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-50 border border-terracotta-200 rounded-full mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: HEADLINE_DELAY, duration: HEADLINE_DURATION, ease: easeOut }}
        >
          <Image src="/logo.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" aria-hidden="true" />
          <span className="font-[family-name:var(--font-body)] text-sm font-medium text-terracotta-600">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Main heading - appears after plate settles */}
        <motion.h1
          className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-brown-800 leading-[1.1] mb-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: HEADLINE_DELAY, duration: HEADLINE_DURATION, ease: easeOut }}
        >
          {t("hero.heading1")}
          <br />
          <span className="text-terracotta-500">{t("hero.heading2")}</span>
          <br />
          <span className="font-[family-name:var(--font-accent)] text-terracotta-400 font-normal">
            {t("hero.heading3")}
          </span>
        </motion.h1>

        {/* Plate - slides up from bottom, then content continues below */}
        <motion.div
          className="relative flex justify-center items-center my-6"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: PLATE_DURATION, ease: easeOut }}
          aria-hidden
        >
          {/* Plate: rim + inner circle */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-[3px] sm:border-4 border-brown-200 bg-gradient-to-br from-cream to-parchment shadow-md flex items-center justify-center">
            <div className="w-[70%] h-[70%] rounded-full border-2 border-brown-100 bg-white/40" />
          </div>
          {/* Decorative elements around plate */}
          <motion.span
            className="absolute -top-1 -right-2 sm:right-0 text-sage-500/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: DECO_DELAY, duration: DECO_DURATION, ease: easeOut }}
            aria-hidden
          >
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </motion.span>
          <motion.span
            className="absolute -bottom-1 -left-2 sm:left-0 text-sage-600/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: DECO_DELAY + 0.05, duration: DECO_DURATION, ease: easeOut }}
            aria-hidden
          >
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" strokeWidth={1.5} />
          </motion.span>
          <motion.span
            className="absolute top-1/2 -left-3 sm:-left-1 w-1.5 h-1.5 rounded-full bg-brown-300/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: DECO_DELAY + 0.1, duration: DECO_DURATION, ease: easeOut }}
            aria-hidden
          />
          <motion.span
            className="absolute top-1/2 -right-3 sm:-right-1 w-1.5 h-1.5 rounded-full bg-terracotta-300/50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: DECO_DELAY + 0.15, duration: DECO_DURATION, ease: easeOut }}
            aria-hidden
          />
        </motion.div>

        {/* Tagline - 300ms after headline, slight upward motion */}
        <motion.p
          className="font-[family-name:var(--font-body)] text-lg sm:text-xl md:text-2xl text-brown-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TAGLINE_DELAY, duration: TAGLINE_DURATION, ease: easeOut }}
        >
          {t("hero.tagline")}{" "}
          <span className="font-[family-name:var(--font-accent)] text-terracotta-500 text-2xl sm:text-3xl">
            {t("hero.taglineAccent")}
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TAGLINE_DELAY + 0.15, duration: 0.3, ease: easeOut }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-lg rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <ChefHat size={22} />
              {t("hero.cta1")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/70 hover:bg-white border-2 border-brown-200 hover:border-brown-300 text-brown-700 font-bold text-lg rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <BookOpen size={22} />
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats 
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-golden-100 text-golden-600">
              <BookOpen size={22} />
            </div>
            <div className="text-left">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800">500+</p>
              <p className="font-[family-name:var(--font-body)] text-sm text-brown-400">{t("hero.recipesShared")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sage-100 text-sage-600">
              <Users size={22} />
            </div>
            <div className="text-left">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800">1,200+</p>
              <p className="font-[family-name:var(--font-body)] text-sm text-brown-400">{t("hero.happyCooks")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
              <ChefHat size={22} />
            </div>
            <div className="text-left">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800">100%</p>
              <p className="font-[family-name:var(--font-body)] text-sm text-brown-400">{t("hero.homemadeLove")}</p>
            </div>
          </div>
        </div> */}
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 60C960 50 1056 40 1152 42.5C1248 45 1344 60 1392 67.5L1440 75V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
            fill="#FAF0E1"
          />
        </svg>
      </div>
    </section>
  );
}
