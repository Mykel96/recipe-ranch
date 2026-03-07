"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setHasRecoverySession(!!data.session);
    }

    checkSession();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError(t("reset.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("reset.passwordMismatch"));
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(t("reset.success"));
    setPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-parchment to-golden-50">
      <div className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Image src="/logo.png" alt="" width={36} height={36} className="w-9 h-9 object-contain" aria-hidden="true" />
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-brown-800 group-hover:text-terracotta-500 transition-colors">
            Recipe Ranch
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-50 border border-terracotta-200 rounded-full mb-5">
              <KeyRound size={28} className="text-terracotta-500" />
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brown-800 mb-2">
              {t("reset.title")}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-brown-400">
              {t("reset.subtitle")}
            </p>
          </div>

          {hasRecoverySession === false && (
            <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-[family-name:var(--font-body)]">
              {t("reset.invalidSession")}
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-[family-name:var(--font-body)]">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-[family-name:var(--font-body)]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block font-[family-name:var(--font-body)] text-sm font-semibold text-brown-700 mb-1.5"
              >
                {t("reset.newPassword")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream/60 border border-brown-200 rounded-xl text-brown-800 placeholder:text-brown-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-[family-name:var(--font-body)] text-sm font-semibold text-brown-700 mb-1.5"
              >
                {t("reset.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream/60 border border-brown-200 rounded-xl text-brown-800 placeholder:text-brown-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || hasRecoverySession === false}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-md"
            >
              {isLoading ? t("reset.saving") : t("reset.save")}
            </button>
          </form>

          <p className="text-center mt-6 font-[family-name:var(--font-body)] text-sm text-brown-500">
            <Link href="/login" className="font-semibold text-terracotta-500 hover:text-terracotta-600 transition-colors">
              {t("reset.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
