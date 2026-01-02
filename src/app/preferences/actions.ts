"use server";

import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { UserPreferences } from "@/types/recipe-generator";
import { revalidatePath } from "next/cache";

export async function saveUserPreferences(
  preferences: UserPreferences
): Promise<void> {
  const db = await getDb();

  const userId = preferences.userId || "default-user";

  const dbPreferences = {
    id: preferences.id || crypto.randomUUID(),
    userId: userId,
    dietaryRestrictions: JSON.stringify(preferences.dietaryRestrictions),
    allergies: JSON.stringify(preferences.allergies),
    favoriteCuisines: JSON.stringify(preferences.favoriteCuisines),
    dislikedIngredients: JSON.stringify(preferences.dislikedIngredients),
    servingsDefault: preferences.servingsDefault,
    shoppingDay: preferences.shoppingDay,
    lowStockThreshold: preferences.lowStockThreshold.toString(),
    expiryWarningDays: preferences.expiryWarningDays,
    expiryAlerts: preferences.expiryAlerts,
    lowStockAlerts: preferences.lowStockAlerts,
    shoppingReminders: preferences.shoppingReminders,
    recipeSuggestions: preferences.recipeSuggestions,
  };

  const existing = await db
    .select()
    .from(schema.UserPreferences)
    .where(eq(schema.UserPreferences.userId, userId));

  if (existing.length > 0) {
    await db
      .update(schema.UserPreferences)
      .set(dbPreferences)
      .where(eq(schema.UserPreferences.userId, userId));
  } else {
    await db.insert(schema.UserPreferences).values(dbPreferences);
  }

  revalidatePath("/preferences");
}
