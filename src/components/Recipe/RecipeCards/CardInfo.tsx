import { Recipe } from "@/types/recipe";
import React from "react";

const CardInfo = ({
  recipe,
  toggleSave,
}: {
  recipe: Recipe;
  toggleSave: (id: string) => void;
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg flex-1">{recipe.name}</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(recipe.id);
          }}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {recipe.isSaved ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p>🔥 {recipe.calories} calories</p>
        <p>🍽️ Serves {recipe.servings}</p>
        <p>⏱️ {recipe.prepTime + recipe.cookTime} min total</p>
        <p>📂 {recipe.category}</p>
      </div>

      <div className="mt-3 flex gap-2">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {recipe.source}
        </span>
        {recipe.isSaved && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Saved
          </span>
        )}
      </div>
    </div>
  );
};

export default CardInfo;
