import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const recipes = sqliteTable('Recipe', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  ingredients: text('ingredients').notNull(),
  instructions: text('instructions').notNull(),
  prepTime: integer('prepTime').notNull(),
  cookTime: integer('cookTime').notNull(),
  servings: integer('servings').notNull(),
  calories: integer('calories').notNull(),
  category: text('category').notNull(),
  source: text('source').notNull(),
  isSaved: integer('isSaved', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

export const InventoryItem = sqliteTable('InventoryItem', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  expiryDate: integer('expiryDate', { mode: 'timestamp' })
    .notNull(),
  addedDate: integer('addedDate', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type InventoryItem = typeof InventoryItem.$inferSelect;
export type NewInventoryItem = typeof InventoryItem.$inferInsert;

export const ShoppingListItem = sqliteTable('ShoppingListItem', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  purchased: integer('purchased', { mode: 'boolean' }).notNull().default(false),
  expiryDate: integer('expiryDate', { mode: 'timestamp' }),
});

export type ShoppingListItem = typeof ShoppingListItem.$inferSelect;
export type NewShoppingListItem = typeof ShoppingListItem.$inferInsert;
