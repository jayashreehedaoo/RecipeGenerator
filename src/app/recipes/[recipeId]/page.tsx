import { notFound } from 'next/navigation';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { RecipeDetailsClient } from './RecipeDetailsClient';

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;

  // Fetch recipe from database
  const db = await getDb();
  const recipes = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, recipeId))
    .limit(1);

  const recipe = recipes[0];

  if (!recipe) {
    notFound();
  }

  // Convert database format to Recipe type
  const recipeData = {
    id: recipe.id,
    name: recipe.name,
    ingredients: recipe.ingredients.split('\n').filter(Boolean),
    instructions: recipe.instructions.split('\n').filter(Boolean),
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    calories: recipe.calories,
    category: recipe.category,
    source: recipe.source,
    isSaved: recipe.isSaved,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    cuisine: recipe.cuisine,
  };

  return <RecipeDetailsClient recipe={recipeData} />;
}