"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfileAvatarUrl(null);
      return;
    }

    const supabase = createClient();
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setProfileAvatarUrl(data?.avatar_url ?? null);
      });
  }, [user]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarUrl = profileAvatarUrl || user?.user_metadata?.avatar_url;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-brown-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo – immer zur Startseite */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 group"
          >
            <Image src="/logo.png" alt="" width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" aria-hidden="true" />
            <div className="flex flex-col leading-tight">
              <span className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-brown-800 group-hover:text-terracotta-500 transition-colors">
                Recipe Ranch
              </span>
              <span className="font-[family-name:var(--font-accent)] text-xs sm:text-sm text-brown-400 -mt-1 hidden sm:block">
                {t("nav.tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-[family-name:var(--font-body)] text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/recipes"
              className="font-[family-name:var(--font-body)] text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
            >
              {t("nav.recipes")}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLanguage("de")}
                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                  language === "de" ? "border-terracotta-500 scale-110 shadow-md" : "border-brown-200 opacity-60 hover:opacity-100"
                }`}
                aria-label="Deutsch"
                title="Deutsch"
              >
                <svg viewBox="0 0 5 3" className="w-full h-full">
                  <rect width="5" height="1" y="0" fill="#000" />
                  <rect width="5" height="1" y="1" fill="#D00" />
                  <rect width="5" height="1" y="2" fill="#FFCE00" />
                </svg>
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                  language === "en" ? "border-terracotta-500 scale-110 shadow-md" : "border-brown-200 opacity-60 hover:opacity-100"
                }`}
                aria-label="English"
                title="English"
              >
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <clipPath id="navClip"><circle cx="30" cy="15" r="15" /></clipPath>
                  <g clipPath="url(#navClip)">
                    <rect width="60" height="30" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                  </g>
                </svg>
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Plus size={16} />
                  {t("nav.shareRecipe")}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brown-200 hover:border-brown-300 bg-white/60 transition-all"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt=""
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-terracotta-100 flex items-center justify-center">
                        <User size={14} className="text-terracotta-600" />
                      </div>
                    )}
                    <span className="font-[family-name:var(--font-body)] text-sm font-medium text-brown-700 max-w-[120px] truncate">
                      {displayName}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brown-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-brown-100">
                          <p className="font-[family-name:var(--font-body)] text-sm font-semibold text-brown-800 truncate">
                            {displayName}
                          </p>
                          <p className="font-[family-name:var(--font-body)] text-xs text-brown-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brown-600 hover:bg-cream transition-colors font-[family-name:var(--font-body)]"
                        >
                          <User size={14} />
                          {t("nav.myProfile")}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brown-600 hover:bg-cream transition-colors font-[family-name:var(--font-body)]"
                        >
                          <LogOut size={14} />
                          {t("nav.logOut")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="font-[family-name:var(--font-body)] text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
                >
                  {t("nav.logIn")}
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-5 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brown-600 hover:text-terracotta-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-brown-200/50 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/recipes"
              className="block py-2 text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.recipes")}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 py-2">
              <button
                onClick={() => setLanguage("de")}
                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                  language === "de" ? "border-terracotta-500 scale-110 shadow-md" : "border-brown-200 opacity-60 hover:opacity-100"
                }`}
                aria-label="Deutsch"
              >
                <svg viewBox="0 0 5 3" className="w-full h-full">
                  <rect width="5" height="1" y="0" fill="#000" />
                  <rect width="5" height="1" y="1" fill="#D00" />
                  <rect width="5" height="1" y="2" fill="#FFCE00" />
                </svg>
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                  language === "en" ? "border-terracotta-500 scale-110 shadow-md" : "border-brown-200 opacity-60 hover:opacity-100"
                }`}
                aria-label="English"
              >
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <clipPath id="mobileNavClip"><circle cx="30" cy="15" r="15" /></clipPath>
                  <g clipPath="url(#mobileNavClip)">
                    <rect width="60" height="30" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                  </g>
                </svg>
              </button>
            </div>

            <hr className="border-brown-200/50" />

            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center">
                      <User size={16} className="text-terracotta-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-[family-name:var(--font-body)] text-sm font-semibold text-brown-800">
                      {displayName}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-brown-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 w-full py-2 text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={16} />
                  {t("nav.myProfile")}
                </Link>
                <Link
                  href="/recipes/new"
                  className="block text-center py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.shareRecipe")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
                >
                  <LogOut size={16} />
                  {t("nav.logOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-brown-600 hover:text-terracotta-500 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.logIn")}
                </Link>
                <Link
                  href="/signup"
                  className="block text-center py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.signUp")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
