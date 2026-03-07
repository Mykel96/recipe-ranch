"use client";

import { UserPlus, PenTool, Globe, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface Step {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  accent: string;
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps: Step[] = [
    {
      icon: <UserPlus size={28} />,
      number: "01",
      title: t("how.step1Title"),
      description: t("how.step1Desc"),
      accent: "bg-terracotta-100 text-terracotta-600",
    },
    {
      icon: <PenTool size={28} />,
      number: "02",
      title: t("how.step2Title"),
      description: t("how.step2Desc"),
      accent: "bg-golden-100 text-golden-600",
    },
    {
      icon: <Globe size={28} />,
      number: "03",
      title: t("how.step3Title"),
      description: t("how.step3Desc"),
      accent: "bg-sage-100 text-sage-600",
    },
    {
      icon: <Heart size={28} />,
      number: "04",
      title: t("how.step4Title"),
      description: t("how.step4Desc"),
      accent: "bg-brown-100 text-brown-600",
    },
  ];
  return (
    <section className="bg-cream py-20 sm:py-28 texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-accent)] text-terracotta-400 text-2xl">
            {t("how.subtitle")}
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-brown-800 mt-2 mb-4">
            {t("how.title")}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-brown-400 text-lg max-w-2xl mx-auto">
            {t("how.description")}
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative group text-center"
            >
              {/* Step number (background) */}
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-[family-name:var(--font-heading)] text-8xl font-bold text-brown-100 opacity-60 select-none group-hover:text-terracotta-100 transition-colors">
                {step.number}
              </span>

              {/* Icon */}
              <div
                className={`relative w-16 h-16 mx-auto rounded-2xl ${step.accent} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="relative font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 mb-3">
                {step.title}
              </h3>
              <p className="relative font-[family-name:var(--font-body)] text-brown-400 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
