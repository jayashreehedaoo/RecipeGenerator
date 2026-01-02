'use server';

import { revalidatePath } from 'next/cache';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function createInventoryItem(formData: FormData) {
  try {
    const db = await getDb();
    
    await db.insert(schema.InventoryItem).values({
      name: formData.get('name') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      category: formData.get('category') as string,
      expiryDate: new Date(formData.get('expiryDate') as string).getTime(),
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { success: false, error: 'Failed to create item' };
  }
}

export async function updateInventoryItem(id: string, formData: FormData) {
  try {
    const db = await getDb();
    
    await db
      .update(schema.InventoryItem)
      .set({
        name: formData.get('name') as string,
        quantity: Number(formData.get('quantity')),
        unit: formData.get('unit') as string,
        category: formData.get('category') as string,
        expiryDate: new Date(formData.get('expiryDate') as string).getTime(),
      })
      .where(eq(schema.InventoryItem.id, id));

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Failed to update item:', error);
    return { success: false, error: 'Failed to update item' };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const db = await getDb();
    
    await db
      .delete(schema.InventoryItem)
      .where(eq(schema.InventoryItem.id, id));

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete item:', error);
    return { success: false, error: 'Failed to delete item' };
  }
}

export async function bulkDeleteInventoryItems(ids: string[]) {
  try {
    const db = await getDb();
    
    await Promise.all(
      ids.map(id => 
        db.delete(schema.InventoryItem).where(eq(schema.InventoryItem.id, id))
      )
    );

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete items:', error);
    return { success: false, error: 'Failed to delete items' };
  }
}