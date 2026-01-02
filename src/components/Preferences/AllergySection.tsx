import { UserPreferences } from "@/types/recipe-generator";
import { useState } from "react";
import { X } from "lucide-react";

const AllergySection = ({
  preferences,
  onUpdate,
  disabled = false,
}: {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => void;
  disabled?: boolean;
}) => {
  const [allergyInput, setAllergyInput] = useState("");

  // Add allergy
  const addAllergy = () => {
    if (
      allergyInput.trim() &&
      !preferences.allergies.includes(allergyInput.trim())
    ) {
      onUpdate({ allergies: [...preferences.allergies, allergyInput.trim()] });
      setAllergyInput("");
    }
  };

  // Remove allergy
  const removeAllergy = (allergy: string) => {
    onUpdate({
      allergies: preferences.allergies.filter((a: string) => a !== allergy),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🚫 Allergies
      </h2>
      <p className="text-gray-600 mb-4">
        List ingredients you&apos;re allergic to
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          disabled={disabled}
          onKeyPress={(e) => e.key === "Enter" && addAllergy()}
          placeholder="e.g., peanuts, shellfish"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={addAllergy}
          disabled={disabled}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {preferences.allergies.map((allergy: string) => (
          <div
            key={allergy}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full"
          >
            <span className="font-medium">{allergy}</span>
            <button
              onClick={() => removeAllergy(allergy)}
              disabled={disabled}
              className="hover:bg-red-200 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {preferences.allergies.length === 0 && (
          <p className="text-gray-400 italic">No allergies added</p>
        )}
      </div>
    </div>
  );
};

export default AllergySection;
