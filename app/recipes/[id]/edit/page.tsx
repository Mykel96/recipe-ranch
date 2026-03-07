"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, ChefHat, GripVertical, ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCookTime } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = [
  "Breakfast & Brunch",
  "BBQ & Grilling",
  "Comfort Food",
  "Sides & Fixins'",
  "Desserts & Sweets",
  "Drinks",
];

const TAG_OPTIONS = [
  "Breakfast", "Bread", "BBQ", "Main", "Side", "Greens",
  "Seafood", "Drink", "Classic", "Soup", "Appetizer",
  "Baking", "Fried", "Summer", "Comfort", "Fruit", "Dessert",
];

const EMOJI_SUGGESTIONS = [
  "🍳", "🧈", "🐖", "🌽", "🍑", "🍗", "🥬", "🍤",
  "🍵", "🍌", "🥟", "🥩", "🫓", "🍅", "🥧", "🧀",
  "🫔", "🍋", "🍝", "🥗", "🌶️", "🍯", "🥘", "🍽️",
];

interface Ingredient {
  amount: string;
  unit: string;
  item: string;
}

interface Step {
  instruction: string;
}

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [imageMode, setImageMode] = useState<"emoji" | "photo">("emoji");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { amount: "", unit: "", item: "" },
  ]);
  const [steps, setSteps] = useState<Step[]>([{ instruction: "" }]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: recipeData, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !recipeData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const recipe = recipeData as unknown as Record<string, unknown>;

      if (recipe.author_id !== user.id) {
        router.push(`/recipes/${id}`);
        return;
      }

      setTitle(recipe.title as string);
      setDescription(recipe.description as string);
      setEmoji(recipe.emoji as string);
      if (recipe.image_url) {
        setExistingImageUrl(recipe.image_url as string);
        setImagePreview(recipe.image_url as string);
        setImageMode("photo");
      }
      setCategory(recipe.category as string);
      setSelectedTags((recipe.tags as string[]) ?? []);
      setCookTimeMinutes(String(recipe.cook_time_minutes));
      setServings(String(recipe.servings));

      const rawIngredients = ((recipe.ingredients as unknown[]) ?? []) as Array<Record<string, string>>;
      setIngredients(
        rawIngredients.length > 0
          ? rawIngredients.map((i) => ({
              amount: i.amount ?? "",
              unit: i.unit ?? "",
              item: i.item ?? "",
            }))
          : [{ amount: "", unit: "", item: "" }]
      );

      const rawSteps = ((recipe.steps as unknown[]) ?? []) as Array<Record<string, string>>;
      setSteps(
        rawSteps.length > 0
          ? rawSteps.map((s) => ({ instruction: s.instruction ?? "" }))
          : [{ instruction: "" }]
      );

      setIsLoading(false);
    }

    load();
  }, [id, router]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleImageSelect(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError(t("common.imageTooLarge"));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError(t("common.imageWrongType"));
      return;
    }
    setError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function removeImage() {
    if (imagePreview && !existingImageUrl) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { amount: "", unit: "", item: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function addStep() {
    setSteps((prev) => [...prev, { instruction: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { instruction: value } : step))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    let finalImageUrl: string | null = null;

    if (imageMode === "photo") {
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(path, imageFile, { upsert: true });

        if (uploadError) {
          setError(t("common.uploadFailed"));
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(path);
        finalImageUrl = urlData.publicUrl;
      } else if (existingImageUrl) {
        finalImageUrl = existingImageUrl;
      }
    }

    const { error } = await supabase
      .from("recipes")
      .update({
        title,
        description,
        emoji,
        image_url: finalImageUrl,
        category,
        tags: selectedTags,
        cook_time_minutes: parseInt(cookTimeMinutes) || 0,
        cook_time_label: formatCookTime(parseInt(cookTimeMinutes) || 0),
        servings: parseInt(servings) || 1,
        ingredients: ingredients
          .filter((i) => i.item.trim())
          .map((i) => ({ amount: i.amount, unit: i.unit, item: i.item })),
        steps: steps
          .filter((s) => s.instruction.trim())
          .map((s, idx) => ({ order: idx + 1, instruction: s.instruction })),
      } as never)
      .eq("id", id)
      .eq("author_id", user.id);

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(`/recipes/${id}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4" aria-hidden="true">🍽️</span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brown-800 mb-2">
            {t("detail.notFound")}
          </h1>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          >
            {t("detail.browseRecipes")}
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const inputClass =
    "w-full px-4 py-3 bg-cream/60 border border-brown-200 rounded-xl text-brown-800 placeholder:text-brown-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:border-terracotta-400 transition-all font-[family-name:var(--font-body)]";
  const labelClass =
    "block font-[family-name:var(--font-body)] text-sm font-semibold text-brown-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment to-cream">
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Link href={`/recipes/${id}`} className="inline-flex items-center gap-2 group">
          <Image src="/logo.png" alt="" width={36} height={36} className="w-9 h-9 object-contain" aria-hidden="true" />
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-brown-800 group-hover:text-terracotta-500 transition-colors">
            Recipe Ranch
          </span>
        </Link>
        <Link
          href={`/recipes/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brown-500 hover:text-terracotta-500 transition-colors font-[family-name:var(--font-body)]"
        >
          <ArrowLeft size={16} />
          {t("form.backToRecipe")}
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-brown-800 mb-2">
          {t("form.editTitle")}
        </h1>
        <p className="font-[family-name:var(--font-accent)] text-xl text-terracotta-400">
          {t("form.editSubtitle")}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-[family-name:var(--font-body)]">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8 space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
              {t("form.basicInfo")}
            </h2>

            <div>
              <label htmlFor="title" className={labelClass}>{t("form.recipeTitle")}</label>
              <input
                id="title"
                type="text"
                required
                placeholder={t("form.titlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>{t("form.description")}</label>
              <textarea
                id="description"
                required
                rows={3}
                placeholder={t("form.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>{t("form.recipeImage")}</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageMode("emoji")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all font-[family-name:var(--font-body)] ${
                    imageMode === "emoji"
                      ? "bg-terracotta-500 text-white shadow-sm"
                      : "bg-cream/60 text-brown-600 border border-brown-200 hover:border-terracotta-300"
                  }`}
                >
                  {t("form.emoji")}
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("photo")}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all font-[family-name:var(--font-body)] ${
                    imageMode === "photo"
                      ? "bg-terracotta-500 text-white shadow-sm"
                      : "bg-cream/60 text-brown-600 border border-brown-200 hover:border-terracotta-300"
                  }`}
                >
                  <ImageIcon size={14} />
                  {t("form.photo")}
                </button>
              </div>

              {imageMode === "emoji" ? (
                <div className="flex flex-wrap gap-2">
                  {EMOJI_SUGGESTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${
                        emoji === em
                          ? "bg-terracotta-100 border-2 border-terracotta-400 scale-110"
                          : "bg-cream/60 border border-brown-200 hover:border-terracotta-300"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-brown-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-brown-300 bg-cream/40 hover:border-terracotta-400 hover:bg-terracotta-50/30 transition-all cursor-pointer"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageSelect(file);
                      }}
                    >
                      <Upload size={28} className="text-brown-300 mb-2" />
                      <span className="font-[family-name:var(--font-body)] text-sm text-brown-400 font-medium">
                        {t("form.dropImage")}
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-xs text-brown-300 mt-1">
                        {t("form.imageHint")}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(file);
                        }}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>{t("form.category")}</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{t("cat." + cat)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("form.tags")}</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-[family-name:var(--font-body)] ${
                      selectedTags.includes(tag)
                        ? "bg-terracotta-500 text-white shadow-sm"
                        : "bg-cream/60 text-brown-600 border border-brown-200 hover:border-terracotta-300"
                    }`}
                  >
                    {t("tag." + tag)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8 space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
              {t("form.timingServings")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="cookMinutes" className={labelClass}>{t("form.cookTime")}</label>
                <input
                  id="cookMinutes"
                  type="number"
                  required
                  min="1"
                  placeholder="30"
                  value={cookTimeMinutes}
                  onChange={(e) => setCookTimeMinutes(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="servings" className={labelClass}>{t("form.servings")}</label>
                <input
                  id="servings"
                  type="number"
                  required
                  min="1"
                  placeholder="6"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8 space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
              {t("form.ingredients")}
            </h2>
            <div className="space-y-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-start gap-2">
                  <GripVertical size={16} className="mt-3.5 text-brown-300 shrink-0" />
                  <div className="grid grid-cols-[80px_80px_1fr] gap-2 flex-1">
                    <input
                      type="text"
                      placeholder={t("form.amount")}
                      value={ing.amount}
                      onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                      className={`${inputClass} text-center`}
                    />
                    <input
                      type="text"
                      placeholder={t("form.unit")}
                      value={ing.unit}
                      onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder={t("form.ingredientName")}
                      value={ing.item}
                      onChange={(e) => updateIngredient(i, "item", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length === 1}
                    className="mt-3 p-1 text-brown-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-terracotta-500 bg-terracotta-50 hover:bg-terracotta-100 rounded-full transition-colors font-[family-name:var(--font-body)]"
            >
              <Plus size={14} />
              {t("form.addIngredient")}
            </button>
          </div>

          {/* Steps */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brown-100/60 p-6 sm:p-8 space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800">
              {t("form.steps")}
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-terracotta-100 flex items-center justify-center mt-1">
                    <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-terracotta-600">
                      {i + 1}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder={t("form.stepPlaceholder")}
                    value={step.instruction}
                    onChange={(e) => updateStep(i, e.target.value)}
                    className={`${inputClass} resize-none flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    disabled={steps.length === 1}
                    className="mt-3 p-1 text-brown-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-terracotta-500 bg-terracotta-50 hover:bg-terracotta-100 rounded-full transition-colors font-[family-name:var(--font-body)]"
            >
              <Plus size={14} />
              {t("form.addStep")}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-lg"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ChefHat size={22} />
                {t("form.saveChanges")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
