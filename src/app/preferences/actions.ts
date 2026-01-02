'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

// Helper to convert array to comma-separated string
function arrayToString(arr: string[]): string {
  return arr.join(',');
}

// Helper to convert comma-separated string to array
function stringToArray(str: string): string[] {
  return str ? str.split(',').filter(s => s.trim()) : [];
}

/**
 * Get user preferences (returns default user preferences for now)
 */
export async function getUserPreferences() {
  try {
    const db = await getDb();
    const userId = 'default-user'; // TODO: Replace with actual user auth

    // Try to get existing preferences
    const [prefs] = await db
      .select()
      .from(schema.UserPreferences)
      .where(eq(schema.UserPreferences.userId, userId))
      .limit(1);

    if (prefs) {
      // Convert DB format to component format
      return {
        id: prefs.id,
        userId: prefs.userId,
        dietaryRestrictions: stringToArray(prefs.dietaryRestrictions),
        allergies: stringToArray(prefs.allergies),
        favoriteCuisines: stringToArray(prefs.favoriteCuisines),
        dislikedIngredients: stringToArray(prefs.dislikedIngredients),
        servingsDefault: prefs.servingsDefault,
        shoppingDay: prefs.shoppingDay,
        lowStockThreshold: prefs.lowStockThreshold / 100, // Convert from percentage to decimal
        expiryWarningDays: prefs.expiryWarningDays,
        expiryAlerts: prefs.expiryAlerts,
        lowStockAlerts: prefs.lowStockAlerts,
        shoppingReminders: prefs.shoppingReminders,
        recipeSuggestions: prefs.recipeSuggestions,
      };
    }

    // Return default preferences if none exist
    return {
      dietaryRestrictions: [],
      allergies: [],
      favoriteCuisines: [],
      dislikedIngredients: [],
      servingsDefault: 4,
      shoppingDay: 'Sunday',
      lowStockThreshold: 0.2,
      expiryWarningDays: 3,
      expiryAlerts: true,
      lowStockAlerts: true,
      shoppingReminders: true,
      recipeSuggestions: true,
    };
  } catch (error) {
    console.error('Failed to get preferences:', error);
    throw new Error('Failed to load preferences');
  }
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(preferences: {
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteCuisines: string[];
  dislikedIngredients: string[];
  servingsDefault: number;
  shoppingDay: string;
  lowStockThreshold: number;
  expiryWarningDays: number;
  expiryAlerts: boolean;
  lowStockAlerts: boolean;
  shoppingReminders: boolean;
  recipeSuggestions: boolean;
}) {
  try {
    const db = await getDb();
    const userId = 'default-user'; // TODO: Replace with actual user auth
    const now = Date.now();

    // Check if preferences already exist
    const [existing] = await db
      .select()
      .from(schema.UserPreferences)
      .where(eq(schema.UserPreferences.userId, userId))
      .limit(1);

    const dbPreferences = {
      userId,
      dietaryRestrictions: arrayToString(preferences.dietaryRestrictions),
      allergies: arrayToString(preferences.allergies),
      favoriteCuisines: arrayToString(preferences.favoriteCuisines),
      dislikedIngredients: arrayToString(preferences.dislikedIngredients),
      servingsDefault: preferences.servingsDefault,
      shoppingDay: preferences.shoppingDay,
      lowStockThreshold: Math.round(preferences.lowStockThreshold * 100), // Convert to percentage
      expiryWarningDays: preferences.expiryWarningDays,
      expiryAlerts: preferences.expiryAlerts,
      lowStockAlerts: preferences.lowStockAlerts,
      shoppingReminders: preferences.shoppingReminders,
      recipeSuggestions: preferences.recipeSuggestions,
      updatedAt: now,
    };

    if (existing) {
      // Update existing preferences
      await db
        .update(schema.UserPreferences)
        .set(dbPreferences)
        .where(eq(schema.UserPreferences.userId, userId));
    } else {
      // Insert new preferences
      await db.insert(schema.UserPreferences).values({
        ...dbPreferences,
        createdAt: now,
      });
    }

    revalidatePath('/preferences');

    return { success: true };
  } catch (error) {
    console.error('Failed to save preferences:', error);
    throw new Error('Failed to save preferences');
  }
}
