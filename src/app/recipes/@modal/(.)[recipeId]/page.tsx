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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/recipes/${recipeId}`);
        
        if (!response.ok) {
          console.error("Failed to fetch recipe");
          router.back();
          return;
        }

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId, router]);

  const toggleSave = async (id: string) => {
    console.log("Toggle save in modal:", id);
    // Optimistically update UI
    if (recipe) {
      setRecipe({ ...recipe, isSaved: !recipe.isSaved });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

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
