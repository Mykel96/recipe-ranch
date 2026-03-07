"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("footer.home"), href: "/" },
    { label: t("footer.browseRecipes"), href: "/recipes" },
    { label: t("footer.logIn"), href: "/login" },
    { label: t("footer.signUp"), href: "/signup" },
  ];

  const popularCategoryValues = [
    "Breakfast & Brunch",
    "BBQ & Grilling",
    "Desserts & Sweets",
    "Sides & Fixins'",
    "Comfort Food",
  ];

  return (
    <footer className="bg-brown-900 text-brown-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image src="/logo.png" alt="" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" aria-hidden="true" />
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream group-hover:text-golden-400 transition-colors">
                Recepy Ranch
              </span>
            </Link>
            <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 leading-relaxed mb-4">
              {t("footer.description")}
            </p>
            <p className="font-[family-name:var(--font-accent)] text-golden-400 text-lg">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-cream mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-body)] text-sm text-brown-400 hover:text-golden-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recipes */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-cream mb-4">
              {t("footer.popularCategories")}
            </h3>
            <ul className="space-y-2.5">
              {popularCategoryValues.map((value) => (
                <li key={value}>
                  <Link
                    href={`/recipes?category=${encodeURIComponent(value)}`}
                    className="font-[family-name:var(--font-body)] text-sm text-brown-400 hover:text-golden-400 transition-colors"
                  >
                    {t("cat." + value)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter hint */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-cream mb-4">
              {t("footer.stayInTouch")}
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 mb-4 leading-relaxed">
              {t("footer.newsletter")}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-brown-800 border border-brown-700 rounded-full text-sm text-cream placeholder:text-brown-500 focus:outline-none focus:ring-2 focus:ring-golden-500/50 focus:border-golden-500/50"
                aria-label="Email address for newsletter"
                disabled
              />
              <button
                className="px-4 py-2.5 bg-golden-500/20 text-golden-400 text-sm font-semibold rounded-full border border-golden-500/30 cursor-not-allowed opacity-60"
                disabled
                aria-label="Subscribe to newsletter (coming soon)"
              >
                {t("footer.soon")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-brown-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-body)] text-sm text-brown-500">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-[family-name:var(--font-body)] text-sm text-brown-500 hover:text-brown-300 transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="font-[family-name:var(--font-body)] text-sm text-brown-500 hover:text-brown-300 transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
