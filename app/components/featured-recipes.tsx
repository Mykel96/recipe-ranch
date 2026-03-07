"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import RecipeCard from "./recipe-card";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";

interface FeaturedRecipe {
  id: string;
  title: string;
  description: string;
  author: string;
  cookTime: string;
  servings: string;
  emoji: string;
  imageUrl?: string | null;
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
}

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<FeaturedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data } = await supabase
        .from("recipes")
        .select("*, profiles!recipes_author_id_fkey(display_name)")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        const recipeRows = data as unknown as Array<Record<string, unknown> & { profiles: { display_name: string } | null }>;
        const recipeIds = recipeRows.map((recipe) => recipe.id as string);
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

        setRecipes(
          recipeRows.map((r) => {
            const rating = ratingMap.get(r.id as string);
            return {
              id: r.id as string,
              title: r.title as string,
              description: r.description as string,
              author: r.profiles?.display_name ?? "Unknown",
              cookTime: r.cook_time_label as string,
              servings: String(r.servings),
              emoji: r.emoji as string,
              imageUrl: (r.image_url as string) ?? null,
              tags: (r.tags as string[]) ?? [],
              ratingAvg: rating && rating.count > 0 ? rating.sum / rating.count : 0,
              ratingCount: rating?.count ?? 0,
            };
          })
        );
      }

      setIsLoading(false);
    }

    load();
  }, []);

  return (
    <section className="bg-parchment py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="font-[family-name:var(--font-accent)] text-terracotta-400 text-2xl">
            {t("featured.subtitle")}
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-brown-800 mt-2 mb-4">
            {t("featured.title")}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-brown-400 text-lg max-w-2xl mx-auto">
            {t("featured.description")}
          </p>
        </div>

        {/* Recipe grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4" aria-hidden="true">👨‍🍳</span>
            <p className="font-[family-name:var(--font-body)] text-brown-400 text-lg">
              {t("featured.empty")}
            </p>
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brown-700 hover:bg-brown-800 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
          >
            {t("featured.viewAll")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
