import React from "react";
import { CUISINE_OPTIONS, UserPreferences } from "@/types/recipe-generator";

const FavoriteCuisineSection = ({
  preferences,
  onUpdate,
  disabled = false,
}: {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => void;
  disabled?: boolean;
}) => {
  const toggleCuisine = (option: string) => {
    onUpdate({
      favoriteCuisines: preferences.favoriteCuisines.includes(option)
        ? preferences.favoriteCuisines.filter((c: string) => c !== option)
        : [...preferences.favoriteCuisines, option],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🌍 Favorite Cuisines
      </h2>
      <p className="text-gray-600 mb-4">Choose cuisines you enjoy</p>
      <div className="flex flex-wrap gap-2">
        {CUISINE_OPTIONS.map((option: string) => (
          <button
            key={option}
            onClick={() => toggleCuisine(option)}
            disabled={disabled}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              preferences.favoriteCuisines.includes(option)
                ? "bg-purple-500 text-white shadow-md hover:bg-purple-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCuisineSection;
