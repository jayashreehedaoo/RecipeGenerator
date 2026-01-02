"use client";

import AllergySection from "@/components/Preferences/AllergySection";
import DefaultSection from "@/components/Preferences/DefaultSection";
import DietarySection from "@/components/Preferences/DietarySection";
import DislikedFoodSection from "@/components/Preferences/DislikedFoodSection";
import FavoriteCuisineSection from "@/components/Preferences/FavoriteCuisineSection";
import NotificationSection from "@/components/Preferences/NotificationSection";
import { UserPreferences } from "@/types/recipe-generator";
import { useState, useOptimistic, useTransition } from "react";
import { saveUserPreferences } from "./actions";

export default function PreferencesClientWrapper({
  initialPreferences,
}: {
  initialPreferences: UserPreferences;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticPreferences, setOptimisticPreferences] = useOptimistic(
    initialPreferences,
    (state, newPreferences: UserPreferences) => newPreferences
  );
  const [saveMessage, setSaveMessage] = useState("");

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...optimisticPreferences, ...updates };

    startTransition(async () => {
      // Optimistic update - UI updates immediately
      setOptimisticPreferences(newPreferences);

      try {
        // Actual save happens in background
        await saveUserPreferences(newPreferences);
        setSaveMessage("Saved! ✓");
      } catch (error) {
        console.log("Failed to save", error);
        setSaveMessage("Failed to save");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⚙️ Preferences
          </h1>
          <p className="text-gray-600">
            Customize your recipe and cooking experience
          </p>
        </div>

        {isPending && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Saving...</span>
          </div>
        )}

        {saveMessage && !isPending && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              saveMessage.includes("Saved")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">
          <DefaultSection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />

          <DislikedFoodSection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />

          <FavoriteCuisineSection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />

          <DietarySection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />

          <AllergySection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />

          <NotificationSection
            preferences={optimisticPreferences}
            onUpdate={(updates) => updatePreferences(updates)}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}
