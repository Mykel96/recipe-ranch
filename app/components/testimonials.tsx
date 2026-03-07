"use client";

import { useTranslation } from "@/lib/i18n/context";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  emoji: string;
}

export default function Testimonials() {
  const { t } = useTranslation();
  const testimonials: Testimonial[] = [
    {
      quote: t("testimonials.quote1"),
      name: t("testimonials.name1"),
      role: t("testimonials.role1"),
      emoji: "👩‍🍳",
    },
    {
      quote: t("testimonials.quote2"),
      name: t("testimonials.name2"),
      role: t("testimonials.role2"),
      emoji: "🤠",
    },
    {
      quote: t("testimonials.quote3"),
      name: t("testimonials.name3"),
      role: t("testimonials.role3"),
      emoji: "🍰",
    },
  ];
  return (
    <section className="bg-brown-800 py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative accents */}
      <div className="absolute top-10 left-10 text-5xl opacity-10 select-none" aria-hidden="true">✦</div>
      <div className="absolute bottom-10 right-10 text-5xl opacity-10 select-none" aria-hidden="true">✦</div>
      <div className="absolute top-1/2 left-1/4 text-3xl opacity-[0.05] select-none" aria-hidden="true">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="font-[family-name:var(--font-accent)] text-golden-400 text-2xl">
            {t("testimonials.subtitle")}
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-brown-300 text-lg max-w-2xl mx-auto">
            {t("testimonials.description")}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-brown-700/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-brown-600/30 hover:border-golden-500/30 transition-colors"
            >
              {/* Quote */}
              <div className="mb-6">
                <span className="font-[family-name:var(--font-heading)] text-4xl text-golden-400 leading-none" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="font-[family-name:var(--font-body)] text-cream/90 leading-relaxed mt-2">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-brown-600/30">
                <span className="text-3xl" aria-hidden="true">{testimonial.emoji}</span>
                <div>
                  <p className="font-[family-name:var(--font-heading)] font-bold text-cream">
                    {testimonial.name}
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-sm text-brown-300">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
