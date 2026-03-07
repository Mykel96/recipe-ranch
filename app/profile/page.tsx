"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Heart, Plus, Calendar, Mail, User, Pencil, Check, X } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import RecipeCard from "../components/recipe-card";
import type { RecipeCardData } from "../components/recipe-card";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Tab = "recipes" | "favorites";

const AVATAR_OPTIONS = [
  { id: "cowboy", src: "/avatars/cowboy.png", label: "Cowboy" },
  { id: "cowgirl", src: "/avatars/cowgirl.png", label: "Cowgirl" },
  { id: "cook", src: "/avatars/cook.png", label: "Ranch Cook" },
  { id: "kid", src: "/avatars/kid.png", label: "Little Wrangler" },
  { id: "rancher", src: "/avatars/rancher.png", label: "Rancher" },
  { id: "beard", src: "/avatars/beard.png", label: "Lumberjack" },
  { id: "stylish", src: "/avatars/stylish.png", label: "Trendsetter" },
  { id: "oldtimer", src: "/avatars/oldtimer.png", label: "Old Timer" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("recipes");
  const [myRecipes, setMyRecipes] = useState<RecipeCardData[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeCardData[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const { t } = useTranslation();

  const fetchMyRecipes = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("recipes")
      .select("*")
      .eq("author_id", userId)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (data) {
      const recipeIds = data.map((recipe) => recipe.id);
      const ratingMap = new Map<string, { sum: number; count: number }>();

      if (recipeIds.length > 0) {
        const { data: ratings } = await supabase
          .from("ratings")
          .select("recipe_id, score")
          .in("recipe_id", recipeIds);

        if (ratings) {
          for (const rating of ratings as Array<{ recipe_id: string; score: number }>) {
            const current = ratingMap.get(rating.recipe_id) ?? { sum: 0, count: 0 };
            current.sum += rating.score;
            current.count += 1;
            ratingMap.set(rating.recipe_id, current);
          }
        }
      }

      setMyRecipes(
        data.map((r) => {
          const rating = ratingMap.get(r.id);
          return {
            id: r.id,
            title: r.title,
            description: r.description,
            author: "You",
            cookTime: r.cook_time_label,
            servings: String(r.servings),
            emoji: r.emoji,
            imageUrl: r.image_url ?? null,
            category: r.category,
            tags: r.tags,
            ratingAvg: rating && rating.count > 0 ? rating.sum / rating.count : 0,
            ratingCount: rating?.count ?? 0,
          };
        })
      );
    }
  }, []);

  const fetchFavorites = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data: favs } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId);

    if (!favs || favs.length === 0) {
      setFavoriteRecipes([]);
      setFavoriteIds(new Set());
      return;
    }

    const ids = favs.map((f) => f.recipe_id);
    setFavoriteIds(new Set(ids));

    const { data: recipes } = await supabase
      .from("recipes")
      .select("*, profiles!recipes_author_id_fkey(display_name)")
      .in("id", ids)
      .eq("published", true);

    if (recipes) {
      const ratingMap = new Map<string, { sum: number; count: number }>();
      const recipeIds = recipes.map((recipe) => recipe.id);

      if (recipeIds.length > 0) {
        const { data: ratings } = await supabase
          .from("ratings")
          .select("recipe_id, score")
          .in("recipe_id", recipeIds);

        if (ratings) {
          for (const rating of ratings as Array<{ recipe_id: string; score: number }>) {
            const current = ratingMap.get(rating.recipe_id) ?? { sum: 0, count: 0 };
            current.sum += rating.score;
            current.count += 1;
            ratingMap.set(rating.recipe_id, current);
          }
        }
      }

      setFavoriteRecipes(
        recipes.map((r) => {
          const profile = r.profiles as unknown as { display_name: string } | null;
          const rating = ratingMap.get(r.id);
          return {
            id: r.id,
            title: r.title,
            description: r.description,
            author: profile?.display_name ?? "Unknown",
            cookTime: r.cook_time_label,
            servings: String(r.servings),
            emoji: r.emoji,
            imageUrl: r.image_url ?? null,
            category: r.category,
            tags: r.tags,
            ratingAvg: rating && rating.count > 0 ? rating.sum / rating.count : 0,
            ratingCount: rating?.count ?? 0,
          };
        })
      );
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      if (profile?.avatar_url) {
        setProfileAvatarUrl(profile.avatar_url);
      }

      setIsLoading(false);
      fetchMyRecipes(user.id);
      fetchFavorites(user.id);
    });
  }, [router, fetchMyRecipes, fetchFavorites]);

  async function handleAvatarSelect(avatarSrc: string) {
    if (!user || isSavingAvatar) return;
    setIsSavingAvatar(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ avatar_url: avatarSrc })
      .eq("id", user.id);
    setProfileAvatarUrl(avatarSrc);
    setShowAvatarPicker(false);
    setIsSavingAvatar(false);
  }

  function handleFavoriteToggle(recipeId: string, favorited: boolean) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(recipeId);
      else next.delete(recipeId);
      return next;
    });
    if (!favorited) {
      setFavoriteRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream flex items-center justify-center pt-20">
          <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl = profileAvatarUrl || user.user_metadata?.avatar_url;
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Header */}
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-parchment to-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-terracotta-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={40} className="text-terracotta-500" />
                  </div>
                )}
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                  aria-label="Change avatar"
                >
                  <Pencil size={14} />
                </button>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-brown-800 mb-1">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-brown-400 font-[family-name:var(--font-body)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} />
                    {t("profile.joined")} {joinDate}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800">
                      {myRecipes.length}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-brown-400">{t("profile.recipes")}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800">
                      {favoriteIds.size}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-brown-400">{t("profile.favorites")}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="sm:ml-auto">
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  {t("nav.shareRecipe")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs + content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Tab bar */}
          <div className="flex gap-1 mb-8 border-b border-brown-200/60">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px font-[family-name:var(--font-body)] ${
                activeTab === "recipes"
                  ? "border-terracotta-500 text-terracotta-600"
                  : "border-transparent text-brown-400 hover:text-brown-600"
              }`}
            >
              <BookOpen size={16} />
              {t("profile.myRecipes")}
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px font-[family-name:var(--font-body)] ${
                activeTab === "favorites"
                  ? "border-terracotta-500 text-terracotta-600"
                  : "border-transparent text-brown-400 hover:text-brown-600"
              }`}
            >
              <Heart size={16} />
              {t("profile.likedRecipes")}
            </button>
          </div>

          {/* My Recipes */}
          {activeTab === "recipes" && (
            <>
              {myRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {myRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        showCategory
                        userId={user.id}
                        authorId={user.id}
                        onDelete={(recipeId) => setMyRecipes((prev) => prev.filter((r) => r.id !== recipeId))}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  emoji="👨‍🍳"
                  title={t("profile.noRecipes")}
                  description={t("profile.noRecipesDesc")}
                  actionLabel={t("profile.shareFirst")}
                  actionHref="/recipes/new"
                />
              )}
            </>
          )}

          {/* Liked Recipes */}
          {activeTab === "favorites" && (
            <>
              {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {favoriteRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        showCategory
                        showFavorite
                        isFavorited={favoriteIds.has(recipe.id)}
                        userId={user.id}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  emoji="❤️"
                  title={t("profile.noFavorites")}
                  description={t("profile.noFavoritesDesc")}
                  actionLabel={t("profile.browseRecipes")}
                  actionHref="/recipes"
                />
              )}
            </>
          )}
        </section>
      </main>

      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-brown-100 p-6 sm:p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
                {t("profile.chooseAvatar")}
              </h3>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-1.5 text-brown-400 hover:text-brown-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.src)}
                  disabled={isSavingAvatar}
                  className={`relative group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105 ${
                    avatarUrl === avatar.src
                      ? "bg-terracotta-50 ring-2 ring-terracotta-400"
                      : "hover:bg-cream"
                  }`}
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.label}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  />
                  <span className="font-[family-name:var(--font-body)] text-[10px] sm:text-xs text-brown-500 font-medium">
                    {avatar.label}
                  </span>
                  {avatarUrl === avatar.src && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-terracotta-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {isSavingAvatar && (
              <div className="flex items-center justify-center mt-4">
                <div className="w-5 h-5 border-2 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  emoji: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="text-center py-20">
      <span className="text-6xl block mb-4" aria-hidden="true">{emoji}</span>
      <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800 mb-2">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-brown-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
