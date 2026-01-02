import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const { recipeId } = await params;
    
    const db = await getDb();
    const recipes = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, recipeId))
      .limit(1);

    const recipe = recipes[0];

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
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

    return NextResponse.json(recipeData);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}
