import { getDb, schema } from "@/db";
import RecipeClientWrapper from "./RecipeClientWrapper";

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function RecipePage() {
  const db = await getDb();
  
  // Fetch all recipes from database
  const recipes = await db
    .select()
    .from(schema.recipes)
    .orderBy(schema.recipes.createdAt);

  // Pass DbRecipe data directly - no conversion needed
  return <RecipeClientWrapper initialRecipes={recipes} />;
}