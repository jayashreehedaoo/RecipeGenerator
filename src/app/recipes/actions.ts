"use server";

import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { Recipe } from "@/db/schema";

export async function createRecipe(
  data: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">
): Promise<Recipe> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const now = Date.now();

  const newRecipe: Recipe = {
    id,
    ...data,
    isSaved: false,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(schema.recipes).values(newRecipe);

  // ✅ Return the created recipe
  return newRecipe;
}

export async function updateRecipe(
  id: string,
  data: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">
): Promise<Recipe> {
  const db = await getDb();
  const now = Date.now();

  const updatedRecipe = {
    ...data,
    updatedAt: now,
  };

  await db
    .update(schema.recipes)
    .set(updatedRecipe)
    .where(eq(schema.recipes.id, id));

  // ✅ Fetch and return the updated recipe
  const [result] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, id));

  return result;
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(schema.recipes).where(eq(schema.recipes.id, id));
}

export async function toggleSaveRecipe(id: string): Promise<Recipe> {
  const db = await getDb();

  // Fetch current recipe
  const [currentRecipe] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, id));

  if (!currentRecipe) {
    throw new Error("Recipe not found");
  }

  // Toggle isSaved
  const updatedRecipe = {
    isSaved: !currentRecipe.isSaved,
    updatedAt: Date.now(),
  };

  await db
    .update(schema.recipes)
    .set(updatedRecipe)
    .where(eq(schema.recipes.id, id));

  // ✅ Return the updated recipe with all fields
  return {
    ...currentRecipe,
    ...updatedRecipe,
  };
}