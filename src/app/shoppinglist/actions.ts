'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { ShoppingListItem } from '@/types/recipe-generator';

export async function addShoppingListItem(formData: Omit<ShoppingListItem, 'id' | 'createdAt'>) {
  try {
    const db = await getDb();
    
    await db.insert(schema.ShoppingListItem).values({
      id: crypto.randomUUID(),
      name: formData.name,
      quantity: formData.quantity,
      unit: formData.unit,
      category: formData.category,
      purchased: false,
    });

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { success: false, error: 'Failed to create item' };
  }
}

export async function updateShoppingListItem(formData: ShoppingListItem) {
  try {
    const db = await getDb();
    
    await db
      .update(schema.ShoppingListItem)
      .set({
        name: formData.name,
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).getTime() : undefined,
        purchased: formData.purchased,
      })
      .where(eq(schema.ShoppingListItem.id, formData.id));

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    console.error('Failed to update item:', error);
    return { success: false, error: 'Failed to update item' };
  }
}

export async function deleteShoppingListItem(id: string) {
  try {
    const db = await getDb();
    
    await db
      .delete(schema.ShoppingListItem)
      .where(eq(schema.ShoppingListItem.id, id));

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete item:', error);
    return { success: false, error: 'Failed to delete item' };
  }
}

export async function bulkDeleteShoppingListItems() {
  try {
    const db = await getDb();

    await db.delete(schema.ShoppingListItem);

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete items:', error);
    return { success: false, error: 'Failed to delete items' };
  }
}

/**
 * Parse ingredient string to extract quantity, unit, and name
 */
function parseIngredient(ingredient: string): {
  quantity: number;
  unit: string;
  name: string;
  category: string;
} {
  const cleaned = ingredient.trim();
  
  // Common units
  const units = [
    'cup', 'cups', 'tablespoon', 'tablespoons', 'tbsp', 'teaspoon', 'teaspoons', 'tsp',
    'pound', 'pounds', 'lb', 'lbs', 'ounce', 'ounces', 'oz', 'gram', 'grams', 'g',
    'kilogram', 'kilograms', 'kg', 'liter', 'liters', 'l', 'milliliter', 'milliliters', 'ml',
    'piece', 'pieces', 'pcs', 'whole', 'clove', 'cloves', 'can', 'cans', 'package', 'packages',
    'bunch', 'bunches', 'slice', 'slices', 'pinch', 'dash', 'to taste'
  ];

  // Try to match pattern: [number] [unit] [name]
  const numberMatch = cleaned.match(/^(\d+\.?\d*|\d*\.?\d+)/);
  
  if (numberMatch) {
    const quantity = parseFloat(numberMatch[1]);
    const rest = cleaned.substring(numberMatch[0].length).trim();
    
    // Try to find unit
    for (const unit of units) {
      const unitRegex = new RegExp(`^${unit}\\b`, 'i');
      if (unitRegex.test(rest)) {
        const name = rest.substring(unit.length).trim();
        return {
          quantity,
          unit,
          name: name || cleaned,
          category: guessCategory(name || cleaned),
        };
      }
    }
    
    // No unit found, just quantity and name
    return {
      quantity,
      unit: 'whole',
      name: rest || cleaned,
      category: guessCategory(rest || cleaned),
    };
  }
  
  // No quantity found, default to 1
  return {
    quantity: 1,
    unit: 'whole',
    name: cleaned,
    category: guessCategory(cleaned),
  };
}

/**
 * Guess category based on ingredient name
 */
function guessCategory(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.match(/chicken|beef|pork|lamb|turkey|fish|salmon|shrimp|meat/)) {
    return 'Meat & Seafood';
  }
  if (nameLower.match(/milk|cheese|yogurt|butter|cream|egg/)) {
    return 'Dairy & Eggs';
  }
  if (nameLower.match(/lettuce|tomato|onion|carrot|potato|pepper|broccoli|spinach|garlic/)) {
    return 'Vegetables';
  }
  if (nameLower.match(/apple|banana|orange|berry|grape|lemon|lime/)) {
    return 'Fruits';
  }
  if (nameLower.match(/bread|pasta|rice|flour|cereal|oat/)) {
    return 'Grains & Bakery';
  }
  if (nameLower.match(/oil|vinegar|sauce|salt|pepper|spice|herb/)) {
    return 'Condiments & Spices';
  }
  
  return 'Other';
}

/**
 * Add all recipe ingredients to shopping list
 */
export async function addRecipeToShoppingList(
  recipeId: string,
  recipeName: string,
  ingredients: string[]
) {
  try {
    const db = await getDb();
    let addedCount = 0;
    let updatedCount = 0;

    // Parse and add each ingredient
    for (const ingredient of ingredients) {
      // Try to parse quantity, unit, and name from ingredient string
      const parsed = parseIngredient(ingredient);
      
      // Check if item already exists
      const existingItems = await db
        .select()
        .from(schema.ShoppingListItem)
        .where(eq(schema.ShoppingListItem.name, parsed.name));

      if (existingItems.length > 0) {
        // Update quantity if item exists
        const existing = existingItems[0];
        await db
          .update(schema.ShoppingListItem)
          .set({
            quantity: existing.quantity + parsed.quantity,
          })
          .where(eq(schema.ShoppingListItem.id, existing.id));
        updatedCount++;
      } else {
        // Insert new item
        await db.insert(schema.ShoppingListItem).values({
          name: parsed.name,
          quantity: parsed.quantity,
          unit: parsed.unit,
          category: parsed.category,
          purchased: false,
        });
        addedCount++;
      }
    }

    revalidatePath('/shoppinglist');
    
    return { 
      success: true, 
      message: `Added ${addedCount} new items and updated ${updatedCount} existing items from "${recipeName}"`,
      addedCount,
      updatedCount
    };
  } catch (error) {
    console.error('Failed to add recipe to shopping list:', error);
    return { 
      success: false, 
      error: 'Failed to add recipe to shopping list' 
    };
  }
}
