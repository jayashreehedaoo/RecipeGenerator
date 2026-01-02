'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
import {
  generateRecipeFromInventory,
  extractRecipeFromUrl,
} from '@/lib/gemini/recipe-generator';

/**
 * Generate recipe from inventory using AI
 */
export async function generateRecipeFromInventoryAction(preferences?: {
  cuisine?: string;
  difficulty?: string;
  dietary?: string;
  maxPrepTime?: number;
}) {
  try {
    console.log('[Action] Generating recipe from inventory...', preferences);
    
    const db = await getDb();

    // Get all inventory items
    const inventoryItems = await db.select().from(schema.InventoryItem);

    if (inventoryItems.length === 0) {
      return {
        success: false,
        error: 'No inventory items available. Please add items to your inventory first.',
      };
    }

    console.log('[Action] Found inventory items:', inventoryItems.length);

    // Generate recipe using OpenAI
    const generatedRecipe = await generateRecipeFromInventory(
      inventoryItems,
      preferences
    );

    // Save recipe to database
    const now = Date.now();

    await db.insert(schema.recipes).values({
      name: generatedRecipe.name,
      ingredients: generatedRecipe.ingredients.join('\n'),
      instructions: generatedRecipe.instructions.join('\n'),
      prepTime: generatedRecipe.prepTime,
      cookTime: generatedRecipe.cookTime,
      servings: generatedRecipe.servings,
      calories: generatedRecipe.calories,
      category: generatedRecipe.category || 'Main Course',
      cuisine: generatedRecipe.cuisine || '',
      source: 'AI Generated',
      isSaved: false,
      createdAt: now,
      updatedAt: now,
    });

    console.log('[Action] Recipe saved successfully');

    revalidatePath('/recipes');

    return {
      success: true,
      recipe: {
        name: generatedRecipe.name,
      },
    };
  } catch (error) {
    console.error('[Action] Failed to generate recipe:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recipe. Please try again.',
    };
  }
}

/**
 * Extract recipe from URL using AI
 */
export async function extractRecipeFromUrlAction(
  url: string,
  contentText?: string
) {
  try {
    console.log('[Action] Extracting recipe from URL...', { url });
    
    const db = await getDb();

    // Extract recipe using OpenAI
    const extractedRecipe = await extractRecipeFromUrl(url, contentText);

    // Save recipe to database
    const now = Date.now();

    await db.insert(schema.recipes).values({
      name: extractedRecipe.name,
      ingredients: extractedRecipe.ingredients.join('\n'),
      instructions: extractedRecipe.instructions.join('\n'),
      prepTime: extractedRecipe.prepTime,
      cookTime: extractedRecipe.cookTime,
      servings: extractedRecipe.servings,
      calories: extractedRecipe.calories,
      category: extractedRecipe.category || 'Main Course',
      cuisine: extractedRecipe.cuisine || '',
      source: url,
      isSaved: false,
      createdAt: now,
      updatedAt: now,
    });

    console.log('[Action] Recipe saved successfully');

    revalidatePath('/recipes');

    return {
      success: true,
      recipe: {
        name: extractedRecipe.name,
      },
    };
  } catch (error) {
    console.error('[Action] Failed to extract recipe:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract recipe. Please try again.',
    };
  }
}