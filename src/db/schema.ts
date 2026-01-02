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
  createdAt: integer('createdAt').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt').notNull().default(sql`(unixepoch())`),
  cuisine: text('cuisine').notNull().default('Unknown'),
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

export const InventoryItem = sqliteTable('InventoryItem', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  expiryDate: integer('expiryDate').notNull(),
  addedDate: integer('addedDate').notNull().default(sql`(unixepoch())`),
});

export type InventoryItem = typeof InventoryItem.$inferSelect;
export type NewInventoryItem = typeof InventoryItem.$inferInsert;

export const ShoppingListItem = sqliteTable('ShoppingListItem', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  purchased: integer('purchased', { mode: 'boolean' }).notNull().default(false),
  expiryDate: integer('expiryDate'),
});

export type ShoppingListItem = typeof ShoppingListItem.$inferSelect;
export type NewShoppingListItem = typeof ShoppingListItem.$inferInsert;

export const UserPreferences = sqliteTable('UserPreferences', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().default('default-user'), // For future multi-user support
  
  // Dietary Preferences (stored as comma-separated strings)
  dietaryRestrictions: text('dietaryRestrictions').notNull().default(''),
  allergies: text('allergies').notNull().default(''),
  favoriteCuisines: text('favoriteCuisines').notNull().default(''),
  dislikedIngredients: text('dislikedIngredients').notNull().default(''),
  
  // Default Settings
  servingsDefault: integer('servingsDefault').notNull().default(4),
  
  // Shopping Preferences
  shoppingDay: text('shoppingDay').notNull().default('Sunday'),
  lowStockThreshold: integer('lowStockThreshold').notNull().default(20), // Stored as percentage (0-100)
  expiryWarningDays: integer('expiryWarningDays').notNull().default(3),
  
  // Notification Settings
  expiryAlerts: integer('expiryAlerts', { mode: 'boolean' }).notNull().default(true),
  lowStockAlerts: integer('lowStockAlerts', { mode: 'boolean' }).notNull().default(true),
  shoppingReminders: integer('shoppingReminders', { mode: 'boolean' }).notNull().default(true),
  recipeSuggestions: integer('recipeSuggestions', { mode: 'boolean' }).notNull().default(true),
  
  createdAt: integer('createdAt').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt').notNull().default(sql`(unixepoch())`),
});

export type UserPreferences = typeof UserPreferences.$inferSelect;
export type NewUserPreferences = typeof UserPreferences.$inferInsert;