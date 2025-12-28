import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const recipes = sqliteTable('Recipe', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  ingredients: text('ingredients').notNull(), // JSON string
  instructions: text('instructions').notNull(), // JSON string
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
