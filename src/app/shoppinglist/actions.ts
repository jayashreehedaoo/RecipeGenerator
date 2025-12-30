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
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
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