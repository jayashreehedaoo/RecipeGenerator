"use client";

import { Recipe } from "@/types/recipe";
import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = use(params); // Unwrap the Promise
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("./../../../mockdata/recipes.json").then((res) => {
      const recipes = res.default.recipes || res.default;
      const foundRecipe = recipes.find((r: Recipe) => r.id === recipeId);
      setRecipe(foundRecipe || null);
      setLoading(false);
    });
  }, [recipeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-xl">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
        <p className="text-gray-600 mb-6">
          The recipe you're looking for doesn't exist.
        </p>
        <Link
          href="/recipes"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          ← Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/recipes"
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <span className="mr-2">←</span> Back to Recipes
      </Link>

      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Hero Image */}
        <div className="h-64 bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center">
          <span className="text-9xl">🍽️</span>
        </div>

        {/* Title and Meta */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{recipe.name}</h1>
            <button className="text-4xl hover:scale-110 transition-transform">
              {recipe.isSaved ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {recipe.source}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {recipe.category}
            </span>
            {recipe.isSaved && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ❤️ Saved
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold">{recipe.calories}</div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="font-bold">{recipe.servings}</div>
              <div className="text-xs text-gray-600">Servings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="font-bold">{recipe.prepTime} min</div>
              <div className="text-xs text-gray-600">Prep Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold">{recipe.cookTime} min</div>
              <div className="text-xs text-gray-600">Cook Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">📝</span> Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="flex-1">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">👨‍🍳</span> Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {idx + 1}
                </span>
                <span className="flex-1 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
          🛒 Add to Shopping List
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          📊 Generate Recipe
        </button>
        <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
          🖨️ Print Recipe
        </button>
      </div>
    </div>
  );
}