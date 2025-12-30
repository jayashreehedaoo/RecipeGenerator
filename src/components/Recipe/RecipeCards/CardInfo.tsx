import { Recipe } from "@/types/recipe-generator";
import React from "react";

const CardInfo = ({
  recipe,
  toggleSave,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  toggleSave: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
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

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2 pt-3 border-t">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recipe);
              }}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(recipe.id);
              }}
              className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardInfo;
