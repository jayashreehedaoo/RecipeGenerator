import { Recipe } from "@/types/recipe";

type RecipeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe;
    onToggleSave: (id: string) => void;
};

const RecipeModal = ({ isOpen, onClose, recipe, onToggleSave }: RecipeModalProps) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>🔥 {recipe.calories} cal</span>
              <span>🍽️ {recipe.servings} servings</span>
              <span>
                ⏱️ {recipe.prepTime + recipe.cookTime} min
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Ingredients */}
          <div>
            <h3 className="text-xl font-bold mb-3">📝 Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold mb-3">👨‍🍳 Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => onToggleSave(recipe.id)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                recipe.isSaved
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {recipe.isSaved ? "❤️ Unsave Recipe" : "🤍 Save Recipe"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
