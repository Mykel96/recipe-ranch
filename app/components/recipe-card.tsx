"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Users, Heart, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";
import StarRating from "./star-rating";

export interface RecipeCardData {
  id: string;
  title: string;
  description: string;
  author: string;
  cookTime: string;
  servings: string;
  emoji: string;
  imageUrl?: string | null;
  category?: string;
  tags: string[];
  ratingAvg?: number;
  ratingCount?: number;
}

interface RecipeCardProps {
  recipe: RecipeCardData;
  showCategory?: boolean;
  showFavorite?: boolean;
  isFavorited?: boolean;
  userId?: string | null;
  authorId?: string | null;
  onFavoriteToggle?: (recipeId: string, favorited: boolean) => void;
  onDelete?: (recipeId: string) => void;
}

export default function RecipeCard({
  recipe,
  showCategory = false,
  showFavorite = false,
  isFavorited = false,
  userId,
  authorId,
  onFavoriteToggle,
  onDelete,
}: RecipeCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [favorited, setFavorited] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = userId !== null && userId !== undefined && authorId === userId;

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited]);

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!userId || isToggling) return;

    setIsToggling(true);
    const supabase = createClient();

    if (favorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipe.id);
      setFavorited(false);
      onFavoriteToggle?.(recipe.id, false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: userId, recipe_id: recipe.id } as never);
      setFavorited(true);
      onFavoriteToggle?.(recipe.id, true);
    }

    setIsToggling(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!userId || isDeleting) return;
    setIsDeleting(true);
    const supabase = createClient();
    await supabase
      .from("recipes")
      .delete()
      .eq("id", recipe.id)
      .eq("author_id", userId);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    onDelete?.(recipe.id);
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/recipes/${recipe.id}/edit`);
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <article className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-brown-100 cursor-pointer">
        <div className="relative h-44 bg-gradient-to-br from-golden-50 via-cream to-terracotta-50 flex items-center justify-center overflow-hidden">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <span className="text-7xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
              {recipe.emoji}
            </span>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-white/80 backdrop-blur-sm text-brown-600 text-xs font-semibold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          {showCategory && recipe.category && (
            <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-terracotta-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {recipe.category}
            </span>
          )}
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {isAuthor && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-brown-400 hover:text-terracotta-500 hover:bg-white transition-all"
                  aria-label="Edit recipe"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteConfirm(true); }}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-brown-400 hover:text-red-500 hover:bg-white transition-all"
                  aria-label="Delete recipe"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            {showFavorite && userId && (
              <button
                onClick={handleFavorite}
                disabled={isToggling}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  favorited
                    ? "bg-terracotta-500 text-white shadow-md"
                    : "bg-white/80 text-brown-400 hover:text-terracotta-500 hover:bg-white"
                }`}
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={16} fill={favorited ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brown-800 mb-2 group-hover:text-terracotta-500 transition-colors">
            {recipe.title}
          </h3>
          <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 leading-relaxed mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col gap-1 text-brown-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  {recipe.cookTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} />
                  {recipe.servings}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <StarRating value={recipe.ratingAvg ?? 0} size={12} />
                <span className="text-xs text-brown-400">
                  {recipe.ratingCount && recipe.ratingCount > 0
                    ? `${(recipe.ratingAvg ?? 0).toFixed(1)} (${recipe.ratingCount})`
                    : t("rating.noRatings")}
                </span>
              </div>
            </div>
            <span className="font-[family-name:var(--font-accent)] text-terracotta-400 text-base">
              {t("common.by")} {recipe.author}
            </span>
          </div>
        </div>
      </article>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteConfirm(false); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-brown-100 p-6 sm:p-8 max-w-md w-full">
            <span className="text-5xl block text-center mb-4" aria-hidden="true">🗑️</span>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 text-center mb-2">
              {t("common.deleteConfirmTitle")}
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-brown-400 text-center mb-6">
              {t("common.deleteConfirmDesc")} &ldquo;{recipe.title}&rdquo; {t("common.willBeRemoved")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteConfirm(false); }}
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
    </Link>
  );
}
