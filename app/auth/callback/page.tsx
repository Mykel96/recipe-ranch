"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-parchment to-golden-50">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
            aria-hidden="true"
          />
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-brown-800 group-hover:text-terracotta-500 transition-colors">
            Recipe Ranch
          </span>
        </Link>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-terracotta-50 border border-terracotta-200 rounded-full mb-6">
            <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-brown-800 mb-3">
            Signing you in…
          </h1>
          <p className="font-[family-name:var(--font-body)] text-brown-500 mb-6">
            Your sign-in link was confirmed. If nothing happens, you can safely return to the homepage and continue
            from there.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150"
          >
            Back to homepage
          </Link>
        </div>
      </main>
    </div>
  );
}

