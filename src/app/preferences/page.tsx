import { getDb, schema } from "@/db";
import PreferencesClientWrapper from "./PreferencesClientWrapper";
import { UserPreferences } from "@/types/recipe-generator";

export default async function PreferencesPage() {
  const db = await getDb();
  const rawPreferences = await db.select().from(schema.UserPreferences);

  if (rawPreferences.length === 0) {
    const defaultPreferences = getDefaultPreferences();
    return <PreferencesClientWrapper initialPreferences={defaultPreferences} />;
  }

  const raw = rawPreferences[0];

  const preferences: UserPreferences = {
    id: raw.id,
    userId: raw.userId,
    dietaryRestrictions: safeJSONParse(raw.dietaryRestrictions, []),
    allergies: safeJSONParse(raw.allergies, []),
    favoriteCuisines: safeJSONParse(raw.favoriteCuisines, []),
    dislikedIngredients: safeJSONParse(raw.dislikedIngredients, []),
    servingsDefault: raw.servingsDefault,
    shoppingDay: raw.shoppingDay,
    lowStockThreshold: parseFloat(raw.lowStockThreshold),
    expiryWarningDays: raw.expiryWarningDays,
    expiryAlerts: raw.expiryAlerts,
    lowStockAlerts: raw.lowStockAlerts,
    shoppingReminders: raw.shoppingReminders,
    recipeSuggestions: raw.recipeSuggestions,
  };

  return <PreferencesClientWrapper initialPreferences={preferences} />;
}

function getDefaultPreferences(): UserPreferences {
  return {
    id: crypto.randomUUID(),
    userId: "default-user", // ✅ Ensure this is set
    dietaryRestrictions: [],
    allergies: [],
    favoriteCuisines: [],
    dislikedIngredients: [],
    servingsDefault: 4,
    shoppingDay: "Saturday",
    lowStockThreshold: 0.2,
    expiryWarningDays: 3,
    expiryAlerts: true,
    lowStockAlerts: true,
    shoppingReminders: true,
    recipeSuggestions: true,
  };
}

function safeJSONParse<T>(value: string | T, defaultValue: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
  return value;
}
