"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import RecipeCard from "../components/recipe-card";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/context";

interface Recipe {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  cookTime: string;
  cookMinutes: number;
  servings: string;
  emoji: string;
  imageUrl?: string | null;
  category: string;
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
}

const CATEGORIES = [
  "All",
  "Breakfast & Brunch",
  "BBQ & Grilling",
  "Comfort Food",
  "Sides & Fixins'",
  "Desserts & Sweets",
  "Drinks",
];

type SortOption = "name" | "time-asc" | "time-desc" | "servings";

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const { t } = useTranslation();

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "name", label: t("recipesPage.nameAZ") },
    { value: "time-asc", label: t("recipesPage.quickest") },
    { value: "time-desc", label: t("recipesPage.longest") },
    { value: "servings", label: t("recipesPage.mostServings") },
  ];

  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    if (categoryFromQuery && CATEGORIES.includes(categoryFromQuery)) {
      setActiveCategory(categoryFromQuery);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: recipes } = await supabase
        .from("recipes")
        .select("*, profiles!recipes_author_id_fkey(display_name)")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (recipes) {
        const recipeRows = recipes as unknown as Array<Record<string, unknown> & { profiles: { display_name: string } | null }>;
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

        setAllRecipes(
          recipeRows.map((r) => {
            const profile = r.profiles;
            const rating = ratingMap.get(r.id as string);
            return {
              id: r.id as string,
              title: r.title as string,
              description: r.description as string,
              author: profile?.display_name ?? "Unknown",
              authorId: r.author_id as string,
              cookTime: r.cook_time_label as string,
              cookMinutes: r.cook_time_minutes as number,
              servings: String(r.servings),
              emoji: r.emoji as string,
              imageUrl: (r.image_url as string) ?? null,
              category: r.category as string,
              tags: (r.tags as string[]) ?? [],
              ratingAvg: rating && rating.count > 0 ? rating.sum / rating.count : 0,
              ratingCount: rating?.count ?? 0,
            };
          })
        );
      }

      setIsLoadingRecipes(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: favs } = await supabase
          .from("favorites")
          .select("recipe_id")
          .eq("user_id", user.id);
        if (favs) {
          setFavoriteIds(new Set(favs.map((f: { recipe_id: string }) => f.recipe_id)));
        }
      }
    }

    loadData();
  }, []);

  function handleRecipeDelete(recipeId: string) {
    setAllRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }

  function handleFavoriteToggle(recipeId: string, favorited: boolean) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(recipeId);
      else next.delete(recipeId);
      return next;
    });
  }

  const filteredRecipes = useMemo(() => {
    let recipes = [...allRecipes];

    if (search.trim()) {
      const q = search.toLowerCase();
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== "All") {
      recipes = recipes.filter((r) => r.category === activeCategory);
    }

    switch (sortBy) {
      case "name":
        recipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "time-asc":
        recipes.sort((a, b) => a.cookMinutes - b.cookMinutes);
        break;
      case "time-desc":
        recipes.sort((a, b) => b.cookMinutes - a.cookMinutes);
        break;
      case "servings":
        recipes.sort((a, b) => parseInt(b.servings) - parseInt(a.servings));
        break;
    }

    return recipes;
  }, [allRecipes, search, activeCategory, sortBy]);

  const hasActiveFilters = search.trim() !== "" || activeCategory !== "All";

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Hero header */}
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-parchment to-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="font-[family-name:var(--font-accent)] text-terracotta-400 text-2xl">
                {t("recipesPage.subtitle")}
              </span>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold text-brown-800 mt-2 mb-4">
                {t("recipesPage.title")}
              </h1>
              <p className="font-[family-name:var(--font-body)] text-brown-400 text-lg max-w-2xl mx-auto">
                {t("recipesPage.description")}
              </p>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("recipesPage.search")}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-brown-200 rounded-2xl text-brown-800 placeholder:text-brown-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all font-[family-name:var(--font-body)] text-base"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-brown-400 hover:text-brown-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filters & content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Toolbar: categories + sort */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 font-[family-name:var(--font-body)] ${
                    activeCategory === cat
                      ? "bg-terracotta-500 text-white shadow-md"
                      : "bg-white text-brown-600 border border-brown-200 hover:border-terracotta-300 hover:text-terracotta-500"
                  }`}
                >
                  {cat === "All" ? t("recipesPage.all") : t("cat." + cat)}
                </button>
              ))}
            </div>

            {/* Results count + Sort */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="font-[family-name:var(--font-body)] text-sm text-brown-400">
                  <span className="font-bold text-brown-700">{filteredRecipes.length}</span>{" "}
                  {filteredRecipes.length === 1 ? t("recipesPage.foundSingle") : t("recipesPage.found")}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-terracotta-500 bg-terracotta-50 hover:bg-terracotta-100 rounded-full transition-colors font-[family-name:var(--font-body)]"
                  >
                    <X size={12} />
                    {t("recipesPage.clearFilters")}
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-brown-200 rounded-xl text-sm font-medium text-brown-600 hover:border-brown-300 transition-colors font-[family-name:var(--font-body)]"
                >
                  <SlidersHorizontal size={14} />
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  <ChevronDown size={14} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brown-200 rounded-xl shadow-lg z-20 overflow-hidden">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-[family-name:var(--font-body)] transition-colors ${
                            sortBy === option.value
                              ? "bg-terracotta-50 text-terracotta-600 font-semibold"
                              : "text-brown-600 hover:bg-cream"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recipe grid */}
          {isLoadingRecipes ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
                >
                  <RecipeCard
                    recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    author: recipe.author,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    emoji: recipe.emoji,
                    imageUrl: recipe.imageUrl,
                    category: recipe.category,
                    tags: recipe.tags,
                    ratingAvg: recipe.ratingAvg,
                    ratingCount: recipe.ratingCount,
                  }}
                  showCategory
                  showFavorite
                  isFavorited={favoriteIds.has(recipe.id)}
                  userId={userId}
                  authorId={recipe.authorId}
                  onFavoriteToggle={handleFavoriteToggle}
                  onDelete={handleRecipeDelete}
                />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4" aria-hidden="true">🍽️</span>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brown-800 mb-2">
                {t("recipesPage.noResults")}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-brown-400 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? t("recipesPage.noResultsFiltered")
                  : t("recipesPage.noResultsEmpty")}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t("recipesPage.clearAll")}
                </button>
              ) : (
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t("recipesPage.shareRecipe")}
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
