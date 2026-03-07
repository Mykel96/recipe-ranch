"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { getCookie, setCookie } from "@/lib/cookies";

const COOKIE_NAME = "rr_cookie_ack";

export default function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const acknowledged = getCookie(COOKIE_NAME);
    if (!acknowledged) {
      setIsVisible(true);
    }
  }, []);

  function handleAccept() {
    setCookie(COOKIE_NAME, "1", {
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      sameSite: "Lax",
      path: "/",
    });
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6 pointer-events-none"
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-brown-800/95 text-cream rounded-2xl shadow-lg border border-brown-700 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="text-xl sm:text-2xl">
              🍪
            </span>
            <p className="font-[family-name:var(--font-body)] text-sm sm:text-base text-cream/90">
              {t("cookies.message")}
              {" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 text-cream hover:text-golden-100"
              >
                {t("cookies.more")}
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-golden-400 hover:bg-golden-300 text-brown-900 text-sm font-semibold font-[family-name:var(--font-body)] transition-colors"
            >
              {t("cookies.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

