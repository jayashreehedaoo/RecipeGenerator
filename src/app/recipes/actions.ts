'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
import { type Recipe as DbRecipe } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createRecipe(recipeData: {
  name: string;
  ingredients: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  category: string;
  source: string;
  cuisine: string;
  isSaved?: boolean;
}): Promise<DbRecipe> {
  try {
    const db = await getDb();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.insert(schema.recipes).values({
      name: recipeData.name,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      calories: recipeData.calories,
      category: recipeData.category,
      source: recipeData.source,
      cuisine: recipeData.cuisine,
      isSaved: recipeData.isSaved ?? false,
      createdAt: now,
      updatedAt: now,
    });

    // Fetch and return the created recipe
    const [newRecipe] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    
    return newRecipe;
  } catch (error) {
    console.error('Failed to create recipe:', error);
    throw new Error('Failed to create recipe');
  }
}

export async function updateRecipe(
  id: string,
  recipeData: Partial<{
    name: string;
    ingredients: string;
    instructions: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    calories: number;
    category: string;
    source: string;
    cuisine: string;
    isSaved: boolean;
  }>
): Promise<DbRecipe> {
  try {
    const db = await getDb();

    await db
      .update(schema.recipes)
      .set({
        ...recipeData,
        updatedAt: Date.now(),
      })
      .where(eq(schema.recipes.id, id));

    // Fetch and return the updated recipe
    const [updated] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
    
    return updated;
  } catch (error) {
    console.error('Failed to update recipe:', error);
    throw new Error('Failed to update recipe');
  }
}

export async function deleteRecipe(id: string) {
  try {
    const db = await getDb();

    await db.delete(schema.recipes).where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    return { success: false, error: 'Failed to delete recipe' };
  }
}

export async function toggleSaveRecipe(id: string): Promise<DbRecipe> {
  try {
    const db = await getDb();

    // Get current state
    const [recipe] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Toggle isSaved
    await db
      .update(schema.recipes)
      .set({
        isSaved: !recipe.isSaved,
        updatedAt: Date.now(),
      })
      .where(eq(schema.recipes.id, id));

    // Fetch and return the updated recipe
    const [updated] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
    
    return updated;
  } catch (error) {
    console.error('Failed to toggle save recipe:', error);
    throw new Error('Failed to toggle save recipe');
  }
}
