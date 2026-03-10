"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError(t("login.resetNeedEmail"));
      setInfo(null);
      return;
    }

    setIsSendingReset(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsSendingReset(false);
      return;
    }

    setInfo(t("login.resetEmailSent"));
    setIsSendingReset(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-parchment to-golden-50">
      {/* Back to home */}
      <div className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Image src="/logo.png" alt="" width={36} height={36} className="w-9 h-9 object-contain" aria-hidden="true" />
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-brown-800 group-hover:text-terracotta-500 transition-colors">
            Recipe Ranch
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-50 border border-terracotta-200 rounded-full mb-5">
              <Image src="/logo.png" alt="" width={40} height={40} className="w-10 h-10 object-contain" aria-hidden="true" />
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-brown-800 mb-2">
              {t("login.title")}
            </h1>
            <p className="font-[family-name:var(--font-accent)] text-xl text-terracotta-400">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8">
            {/* Error message */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-[family-name:var(--font-body)]">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-[family-name:var(--font-body)]">
                {info}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-[family-name:var(--font-body)] text-sm font-semibold text-brown-700 mb-1.5"
                >
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/60 border border-brown-200 rounded-xl text-brown-800 placeholder:text-brown-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block font-[family-name:var(--font-body)] text-sm font-semibold text-brown-700"
                  >
                    {t("login.password")}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSendingReset}
                    className="font-[family-name:var(--font-body)] text-xs text-terracotta-500 hover:text-terracotta-600 transition-colors disabled:opacity-60"
                  >
                    {isSendingReset ? t("login.sendingReset") : t("login.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-cream/60 border border-brown-200 rounded-xl text-brown-800 placeholder:text-brown-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brown-400 hover:text-brown-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    {t("login.submit")}
                  </>
                )}
              </button>
            </form>

            {/*
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brown-200/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white/70 font-[family-name:var(--font-body)] text-xs text-brown-400">
                  {t("login.orContinue")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cream/60 hover:bg-cream border border-brown-200 rounded-xl text-sm font-semibold text-brown-700 transition-all hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cream/60 hover:bg-cream border border-brown-200 rounded-xl text-sm font-semibold text-brown-700 transition-all hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
            */}
          </div>

          {/* Sign up link */}
          <p className="text-center mt-6 font-[family-name:var(--font-body)] text-sm text-brown-500">
            {t("login.noAccount")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-terracotta-500 hover:text-terracotta-600 transition-colors"
            >
              {t("login.signUpLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
