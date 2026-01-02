import { DIETARY_OPTIONS, UserPreferences } from "@/types/recipe-generator";

const DietarySection = ({
  preferences,
  onUpdate,
  disabled = false,
}: {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => void;
  disabled?: boolean;
}) => {
  const toggleDietary = (option: string) => {
    const updatedDietaryRestrictions = preferences.dietaryRestrictions.includes(
      option
    )
      ? preferences.dietaryRestrictions.filter((d: string) => d !== option)
      : [...preferences.dietaryRestrictions, option];
    onUpdate({ dietaryRestrictions: updatedDietaryRestrictions });
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🥗 Dietary Restrictions
      </h2>
      <p className="text-gray-600 mb-4">Select your dietary preferences</p>
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option: string) => (
          <button
            key={option}
            onClick={() => toggleDietary(option)}
            disabled={disabled}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              preferences.dietaryRestrictions.includes(option)
                ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
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

export default DietarySection;
