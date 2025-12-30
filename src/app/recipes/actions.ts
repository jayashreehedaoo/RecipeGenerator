'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
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
  isSaved?: boolean;
}) {
  try {
    const db = await getDb();
    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(schema.recipes).values({
      id,
      name: recipeData.name,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      calories: recipeData.calories,
      category: recipeData.category,
      source: recipeData.source,
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
    
    // Convert dates to strings for client
    return {
      ...newRecipe,
      createdAt: newRecipe.createdAt.toISOString(),
      updatedAt: newRecipe.updatedAt.toISOString(),
    };
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
    isSaved: boolean;
  }>
) {
  try {
    const db = await getDb();

    await db
      .update(schema.recipes)
      .set({
        ...recipeData,
        updatedAt: new Date(),
      })
      .where(eq(schema.recipes.id, id));

    // Fetch and return the updated recipe
    const [updated] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
    
    // Convert dates to strings for client
    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
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

export async function toggleSaveRecipe(id: string) {
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
        updatedAt: new Date(),
      })
      .where(eq(schema.recipes.id, id));

    // Fetch and return the updated recipe
    const [updated] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));

    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
    
    // Convert dates to strings for client
    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to toggle save recipe:', error);
    throw new Error('Failed to toggle save recipe');
  }
}
