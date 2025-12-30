"use client";

import RecipeModal from "@/components/Recipe/RecipeModal";
import { Recipe } from "@/types/recipe-generator";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function RecipeModalPage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    import("../../../../mockdata/recipes.json").then((res) => {
      const allRecipes = res.default.recipes || res.default;
      const foundRecipe = allRecipes.find((r: Recipe) => r.id === recipeId);
      setRecipe(foundRecipe || null);
    });
  }, [recipeId]);

  const toggleSave = (id: string) => {
    console.log("Toggle save in modal:", id);
    // TODO: Lift this state up or use context for global state
  };

  if (!recipe) return null;

  return (
    <RecipeModal
      isOpen={true}
      onClose={() => router.back()}
      recipe={recipe}
      onToggleSave={toggleSave}
    />
  );
}
