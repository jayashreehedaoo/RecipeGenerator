import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const { recipeId } = await params;

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const recipes = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, recipeId))
      .limit(1);

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = recipes[0];

    console.log(
      "[API] Raw recipe.ingredients type:",
      typeof recipe.ingredients
    );
    console.log("[API] Raw recipe.ingredients:", recipe.ingredients);

    // Convert database format to Recipe type format
    const formattedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.split("\n").filter(Boolean),
      instructions: recipe.instructions.split("\n").filter(Boolean),
    };

    console.log("[API] Formatted ingredients:", formattedRecipe.ingredients);

    return NextResponse.json(formattedRecipe);
  } catch (error) {
    console.error("[API] Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
