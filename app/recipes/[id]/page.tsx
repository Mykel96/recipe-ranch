"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  Heart,
  ArrowLeft,
  ChefHat,
  UtensilsCrossed,
  ListOrdered,
  Pencil,
  Trash2,
} from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import StarRating from "../../components/star-rating";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";

interface Ingredient {
  amount?: string;
  unit?: string;
  item?: string;
}

interface Step {
  order?: number;
  instruction?: string;
}

interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  emoji: string;
  image_url: string | null;
  category: string;
  tags: string[];
  cook_time_minutes: number;
  cook_time_label: string;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
  published: boolean;
  created_at: string;
  author_id: string;
  author_name: string;
}

interface RatingRow {
  user_id: string;
  score: number;
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isSavingRating, setIsSavingRating] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: recipeData, error } = await supabase
        .from("recipes")
        .select("*, profiles!recipes_author_id_fkey(display_name)")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error || !recipeData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const row = recipeData as unknown as Record<string, unknown> & { profiles: { display_name: string } | null };
      setRecipe({
        id: row.id as string,
        title: row.title as string,
        description: row.description as string,
        emoji: row.emoji as string,
        image_url: (row.image_url as string) ?? null,
        category: row.category as string,
        tags: (row.tags as string[]) ?? [],
        cook_time_minutes: row.cook_time_minutes as number,
        cook_time_label: row.cook_time_label as string,
        servings: row.servings as number,
        ingredients: (row.ingredients as Ingredient[]) ?? [],
        steps: (row.steps as Step[]) ?? [],
        published: row.published as boolean,
        created_at: row.created_at as string,
        author_id: row.author_id as string,
        author_name: row.profiles?.display_name ?? "Unknown",
      });

      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id ?? null;
      setUserId(currentUserId);

      if (user) {
        const { data: fav } = await supabase
          .from("favorites")
          .select("recipe_id")
          .eq("user_id", user.id)
          .eq("recipe_id", id)
          .maybeSingle();
        setIsFavorited(!!fav);
      }

      const { data: ratingsData } = await supabase
        .from("ratings")
        .select("user_id, score")
        .eq("recipe_id", id);

      if (ratingsData) {
        const ratings = ratingsData as unknown as RatingRow[];
        const total = ratings.reduce((sum, r) => sum + r.score, 0);
        setRatingCount(ratings.length);
        setRatingAverage(ratings.length > 0 ? total / ratings.length : 0);
        const ownRating = currentUserId ? ratings.find((r) => r.user_id === currentUserId)?.score ?? 0 : 0;
        setUserRating(ownRating);
      }

      setIsLoading(false);
    }

    load();
  }, [id]);

  async function handleFavorite() {
    if (!userId || isToggling) return;
    setIsToggling(true);
    const supabase = createClient();

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", id);
      setIsFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: userId, recipe_id: id } as never);
      setIsFavorited(true);
    }
    setIsToggling(false);
  }

  async function handleDelete() {
    if (!userId || isDeleting) return;
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .eq("author_id", userId);

    if (error) {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    router.push("/profile");
  }

  async function handleRate(score: number) {
    if (!userId || isSavingRating) return;

    setIsSavingRating(true);
    const supabase = createClient();

    await supabase
      .from("ratings")
      .upsert(
        { user_id: userId, recipe_id: id, score } as never,
        { onConflict: "user_id,recipe_id" }
      );

    const { data } = await supabase
      .from("ratings")
      .select("user_id, score")
      .eq("recipe_id", id);

    if (data) {
      const ratings = data as unknown as RatingRow[];
      const total = ratings.reduce((sum, r) => sum + r.score, 0);
      setRatingCount(ratings.length);
      setRatingAverage(ratings.length > 0 ? total / ratings.length : 0);
      setUserRating(score);
    }

    setIsSavingRating(false);
  }

  const isAuthor = userId !== null && recipe?.author_id === userId;

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

  if (notFound || !recipe) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream flex items-center justify-center pt-20">
          <div className="text-center">
            <span className="text-6xl block mb-4" aria-hidden="true">🍽️</span>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brown-800 mb-2">
              {t("detail.notFound")}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-brown-400 mb-6">
              {t("detail.notFoundDesc")}
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
            >
              {t("detail.browseRecipes")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const createdDate = new Date(recipe.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Hero */}
        <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-b from-parchment to-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brown-400 hover:text-terracotta-500 transition-colors font-[family-name:var(--font-body)] mb-8"
            >
              <ArrowLeft size={16} />
              {t("detail.back")}
            </button>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {recipe.image_url ? (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-brown-100 shadow-md shrink-0 relative">
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-golden-50 via-cream to-terracotta-50 rounded-2xl flex items-center justify-center border border-brown-100 shadow-md shrink-0">
                  <span className="text-7xl sm:text-8xl" aria-hidden="true">
                    {recipe.emoji}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-terracotta-500/90 text-white text-xs font-semibold rounded-full">
                    {recipe.category}
                  </span>
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/80 text-brown-600 text-xs font-semibold rounded-full border border-brown-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-brown-800 mb-3">
                  {recipe.title}
                </h1>

                <p className="font-[family-name:var(--font-body)] text-brown-400 text-base sm:text-lg leading-relaxed mb-4">
                  {recipe.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-[family-name:var(--font-body)]">
                  <span className="inline-flex items-center gap-1.5 text-brown-500">
                    <Clock size={16} className="text-terracotta-400" />
                    {recipe.cook_time_label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-brown-500">
                    <Users size={16} className="text-terracotta-400" />
                    {recipe.servings} {t("detail.servings")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-brown-500">
                    <ChefHat size={16} className="text-terracotta-400" />
                    {t("detail.by")}{" "}
                    <span className="font-[family-name:var(--font-accent)] text-terracotta-500 text-base">
                      {recipe.author_name}
                    </span>
                  </span>
                  <span className="text-brown-300 text-xs">
                    {createdDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-brown-500">
                    <StarRating value={ratingAverage} size={14} />
                    <span>
                      {ratingCount > 0
                        ? `${ratingAverage.toFixed(1)} (${ratingCount})`
                        : t("rating.noRatings")}
                    </span>
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-5">
                  {userId && (
                    <button
                      onClick={handleFavorite}
                      disabled={isToggling}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-[family-name:var(--font-body)] ${
                        isFavorited
                          ? "bg-terracotta-500 text-white"
                          : "bg-white text-brown-600 border border-brown-200 hover:border-terracotta-300 hover:text-terracotta-500"
                      }`}
                    >
                      <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                      {isFavorited ? t("detail.savedToFavorites") : t("detail.addToFavorites")}
                    </button>
                  )}
                  {isAuthor && (
                    <>
                      <Link
                        href={`/recipes/${recipe.id}/edit`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-white text-brown-600 border border-brown-200 hover:border-terracotta-300 hover:text-terracotta-500 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-[family-name:var(--font-body)]"
                      >
                        <Pencil size={16} />
                        {t("detail.editRecipe")}
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-[family-name:var(--font-body)]"
                      >
                        <Trash2 size={16} />
                        {t("detail.delete")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8 grid grid-cols-1 gap-8">
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
                    {t("rating.title")}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 mt-1">
                    {ratingCount > 0
                      ? `${t("rating.averagePrefix")} ${ratingAverage.toFixed(1)} ${t("rating.from")} ${ratingCount} ${t("rating.votes")}`
                      : t("rating.noRatingsYet")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={userId ? userRating : ratingAverage}
                    interactive={!!userId}
                    onChange={handleRate}
                    className={isSavingRating ? "opacity-60" : ""}
                  />
                  {isSavingRating && (
                    <div className="w-4 h-4 border-2 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
                  )}
                </div>
              </div>
              {!userId && (
                <p className="mt-3 text-sm text-brown-500">
                  {t("rating.loginPrompt")}
                </p>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Ingredients */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8 h-fit">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 mb-5 flex items-center gap-2">
                <UtensilsCrossed size={20} className="text-terracotta-400" />
                {t("detail.ingredients")}
              </h2>
              {recipe.ingredients.length > 0 ? (
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-terracotta-400 mt-2 shrink-0" />
                      <span className="font-[family-name:var(--font-body)] text-brown-700 text-sm leading-relaxed">
                        {ing.amount && (
                          <span className="font-bold">{ing.amount}</span>
                        )}{" "}
                        {ing.unit && (
                          <span className="text-brown-400">{ing.unit}</span>
                        )}{" "}
                        {ing.item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 italic">
                  {t("detail.noIngredients")}
                </p>
              )}
            </div>

            {/* Steps */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 mb-5 flex items-center gap-2">
                <ListOrdered size={20} className="text-terracotta-400" />
                {t("detail.steps")}
              </h2>
              {recipe.steps.length > 0 ? (
                <ol className="space-y-6">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-terracotta-100 flex items-center justify-center">
                        <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-terracotta-600">
                          {step.order ?? i + 1}
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-body)] text-brown-700 text-sm leading-relaxed pt-2">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 italic">
                  {t("detail.noSteps")}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-brown-100 p-6 sm:p-8 max-w-md w-full">
            <span className="text-5xl block text-center mb-4" aria-hidden="true">🗑️</span>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 text-center mb-2">
              {t("detail.deleteConfirm")}
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 text-center mb-6">
              {t("detail.deleteDesc")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-white border border-brown-200 text-brown-600 font-semibold rounded-xl hover:bg-cream transition-colors font-[family-name:var(--font-body)]"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors font-[family-name:var(--font-body)] flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} />
                    {t("common.delete")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
