import { UserPreferences } from "@/types/recipe-generator";
import { useState } from "react";
import { X } from "lucide-react";

const DislikedFoodSection = ({
  preferences,
  onUpdate,
  disabled = false,
}: {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => void;
  disabled?: boolean;
}) => {
  const [dislikedInput, setDislikedInput] = useState("");

  // Add disliked ingredient
  const addDisliked = () => {
    if (
      dislikedInput.trim() &&
      !preferences.dislikedIngredients.includes(dislikedInput.trim())
    ) {
      onUpdate({
        dislikedIngredients: [
          ...preferences.dislikedIngredients,
          dislikedInput.trim(),
        ],
      });
      setDislikedInput("");
    }
  };

  // Remove disliked ingredient
  const removeDisliked = (ingredient: string) => {
    onUpdate({
      dislikedIngredients: preferences.dislikedIngredients.filter(
        (i: string) => i !== ingredient
      ),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        👎 Disliked Ingredients
      </h2>
      <p className="text-gray-600 mb-4">Ingredients you prefer to avoid</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={dislikedInput}
          onChange={(e) => setDislikedInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addDisliked()}
          placeholder="e.g., cilantro, mushrooms"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={addDisliked}
          disabled={disabled}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {preferences.dislikedIngredients.map((ingredient: string) => (
          <div
            key={ingredient}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full"
          >
            <span className="font-medium">{ingredient}</span>
            <button
              onClick={() => removeDisliked(ingredient)}
              disabled={disabled}
              className="hover:bg-orange-200 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {preferences.dislikedIngredients.length === 0 && (
          <p className="text-gray-400 italic">No disliked ingredients added</p>
        )}
      </div>
    </div>
  );
};

export default DislikedFoodSection;
