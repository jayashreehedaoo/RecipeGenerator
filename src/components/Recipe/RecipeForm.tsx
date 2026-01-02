"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe-generator";

interface RecipeFormProps {
  recipe: Recipe | null;
  onSave: (recipeData: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  isAddMode: boolean;
}

export default function RecipeForm({ recipe, onSave, onCancel, isAddMode }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    calories: 300,
    category: "Main Course",
    source: "Manual",
    cuisine: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // For textarea input (string)
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories,
        category: recipe.category,
        source: recipe.source,
        cuisine: recipe.cuisine || "",
      });
      setIngredientsText(recipe.ingredients.join('\n'));
      setInstructionsText(recipe.instructions.join('\n'));
    }
  }, [recipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert text to arrays
      const ingredients = ingredientsText.split('\n').filter(i => i.trim());
      const instructions = instructionsText.split('\n').filter(i => i.trim());

      await onSave({
        ...formData,
        ingredients,
        instructions,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipe Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Spaghetti Carbonara"
          required
        />
      </div>

      {/* Category & Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Breakfast">🍳 Breakfast</option>
            <option value="Lunch">🥗 Lunch</option>
            <option value="Dinner">🍽️ Dinner</option>
            <option value="Main Course">🍛 Main Course</option>
            <option value="Appetizer">🥟 Appetizer</option>
            <option value="Dessert">🍰 Dessert</option>
            <option value="Snack">🍪 Snack</option>
            <option value="Beverage">🥤 Beverage</option>
            <option value="Salad">🥗 Salad</option>
            <option value="Soup">🍲 Soup</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Source *</label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Manual">✍️ Manual</option>
            <option value="AI Generated">🤖 AI Generated</option>
            <option value="Family Recipe">👨‍👩‍👧‍👦 Family Recipe</option>
            <option value="Online">🌐 Online</option>
            <option value="Cookbook">📖 Cookbook</option>
          </select>
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <label className="block text-sm font-medium mb-1">Cuisine</label>
        <input
          type="text"
          value={formData.cuisine}
          onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Italian, Mexican, Indian"
        />
      </div>

      {/* Time & Servings */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prep Time (min) *</label>
          <input
            type="number"
            min="0"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cook Time (min) *</label>
          <input
            type="number"
            min="0"
            value={formData.cookTime}
            onChange={(e) => setFormData({ ...formData, cookTime: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Servings *</label>
          <input
            type="number"
            min="1"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Calories */}
      <div>
        <label className="block text-sm font-medium mb-1">Calories (per serving) *</label>
        <input
          type="number"
          min="0"
          value={formData.calories}
          onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 450"
          required
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium mb-1">Ingredients *</label>
        <textarea
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter ingredients, one per line..."
          rows={6}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: List each ingredient on a new line
        </p>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-1">Instructions *</label>
        <textarea
          value={instructionsText}
          onChange={(e) => setInstructionsText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter cooking instructions, step by step..."
          rows={8}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Number each step for clarity
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isAddMode ? "Add Recipe" : "Update Recipe"}
        </button>
      </div>
    </form>
  );
}
