# Drizzle ORM Setup Guide

## 📚 What is Drizzle ORM?

Drizzle is a **TypeScript-first ORM** (Object-Relational Mapping) that lets you interact with databases using TypeScript code instead of writing raw SQL queries. It acts as a bridge between your TypeScript application and your database.

### Simple Analogy
Think of it like a translator:
- **You speak**: TypeScript (the language you're comfortable with)
- **Database speaks**: SQL (the database language)
- **Drizzle translates** between the two

---

## 🔧 Steps I Followed to Set Up Drizzle

### Step 1: Removed Prisma
```bash
npm uninstall @prisma/client prisma
```
**Why?** Prisma had issues downloading Windows engine binaries due to Artifactory configuration.

### Step 2: Installed Drizzle & Dependencies
```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

**Packages installed:**
- `drizzle-orm` - The core ORM library
- `@libsql/client` - SQLite database driver (pure JavaScript, no native dependencies!)
- `drizzle-kit` - CLI tool for migrations and schema management

### Step 3: Created Database Schema
**File:** `src/db/schema.ts`

Defined the database structure in TypeScript:
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdate(() => new Date()),
});

// Auto-generated TypeScript types
export type Recipe = typeof recipes.$inferSelect;      // Full recipe object
export type NewRecipe = typeof recipes.$inferInsert;   // For creating new recipes
```

### Step 4: Created Database Client
**File:** `src/db/index.ts`

Set up the connection to the database:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = createClient({
    url: 'file:./dev.db',  // SQLite file location
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export { schema };
```

### Step 5: Created Drizzle Config
**File:** `drizzle.config.ts`

Configuration for Drizzle Kit (migration tool):
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',      // Where your schema is
  out: './drizzle',                  // Where migrations are saved
  dialect: 'sqlite',                 // Database type
  dbCredentials: {
    url: './dev.db',                 // Database file
  },
} satisfies Config;
```

### Step 6: Generated and Applied Schema
```bash
# Generate SQL migration from schema
npx drizzle-kit generate

# Apply migration to create the database
npx drizzle-kit push
```

This created:
- `dev.db` - Your SQLite database file
- `drizzle/0000_jazzy_miss_america.sql` - The SQL migration file

---

## 💡 How to Use Drizzle in Your Code

### Basic CRUD Operations

```typescript
import { getDb, schema } from '@/db';
import { eq, and, or, like, gt } from 'drizzle-orm';

const db = await getDb();

// ✅ SELECT - Get all recipes
const allRecipes = await db.select().from(schema.recipes);

// ✅ SELECT with WHERE - Find specific recipe
const recipe = await db.select()
  .from(schema.recipes)
  .where(eq(schema.recipes.id, 'some-id'));

// ✅ SELECT with multiple conditions
const italianRecipes = await db.select()
  .from(schema.recipes)
  .where(
    and(
      eq(schema.recipes.category, 'Italian'),
      gt(schema.recipes.calories, 300)
    )
  );

// ✅ INSERT - Add new recipe
const newRecipe = await db.insert(schema.recipes)
  .values({
    name: 'Spaghetti Carbonara',
    ingredients: JSON.stringify(['pasta', 'eggs', 'bacon']),
    instructions: JSON.stringify(['Boil pasta', 'Cook bacon', 'Mix']),
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    calories: 450,
    category: 'Italian',
    source: 'traditional',
  })
  .returning(); // Returns the inserted row

// ✅ UPDATE - Modify existing recipe
await db.update(schema.recipes)
  .set({ 
    isSaved: true,
    updatedAt: new Date() 
  })
  .where(eq(schema.recipes.id, recipeId));

// ✅ DELETE - Remove recipe
await db.delete(schema.recipes)
  .where(eq(schema.recipes.id, recipeId));
```

### Advanced Queries

```typescript
// Search by name
const searchResults = await db.select()
  .from(schema.recipes)
  .where(like(schema.recipes.name, '%pasta%'));

// Get saved recipes only
const savedRecipes = await db.select()
  .from(schema.recipes)
  .where(eq(schema.recipes.isSaved, true));

// Order by creation date
const recentRecipes = await db.select()
  .from(schema.recipes)
  .orderBy(schema.recipes.createdAt)
  .limit(10);
```

---

## ⚖️ Drizzle vs Prisma Comparison

### ✅ Drizzle Advantages

| Feature | Drizzle | Prisma |
|---------|---------|--------|
| **Bundle Size** | ~50KB | ~2MB |
| **Native Dependencies** | ❌ None (pure JS) | ✅ Requires engines |
| **Setup Complexity** | Simple | Complex (needs generation) |
| **Build Tools Required** | No | Yes (Python for some drivers) |
| **SQL-like API** | Yes (feels like writing SQL) | No (more abstract) |
| **Type Safety** | Excellent | Excellent |
| **Query Performance** | Very fast | Fast |
| **Learning Curve** | Easy if you know SQL | Moderate |
| **Migrations** | Manual SQL files | Auto-generated |

### 🎯 Why Drizzle Was Better for This Project

1. **No Binary Downloads** - Prisma needed Windows engine binaries from Artifactory which weren't available
2. **No Build Tools** - Works immediately without Python or C++ compilers
3. **Corporate Firewall Friendly** - No external CDN dependencies
4. **Lightweight** - Smaller bundle size = faster app
5. **Transparent** - You can see and understand the SQL being generated

### ⚠️ Drizzle Cons

1. **Less Mature** - Prisma has been around longer, more community resources
2. **Fewer Integrations** - Prisma has more third-party tool integrations
3. **Manual Migrations** - You need to review/modify SQL migrations manually
4. **Smaller Community** - Fewer Stack Overflow answers and tutorials
5. **Less "Magic"** - You need to know more about SQL and databases
6. **No Auto-migrations** - Unlike Prisma, can't automatically detect schema changes

---

## 🤔 When Should You Use Drizzle?

### ✅ Use Drizzle When:

1. **You know SQL** - If you're comfortable with SQL, Drizzle feels natural
2. **You want lightweight** - Building apps where bundle size matters
3. **Corporate environment** - Behind firewalls, can't download binaries
4. **Edge/Serverless** - Deploying to Cloudflare Workers, Deno Deploy, etc.
5. **Full control needed** - Want to see and control exact SQL queries
6. **Simple database** - Single database, straightforward schema
7. **No native dependencies** - Can't install or compile native modules

### ❌ Use Prisma When:

1. **Database beginners** - Don't know SQL well, want more abstraction
2. **Complex migrations** - Need automatic schema diff and migration generation
3. **Multiple databases** - Working with many different database types
4. **Rapid prototyping** - Want to iterate quickly without writing migrations
5. **Prisma Studio** - Want the visual database browser (though Drizzle has this too)
6. **Team prefers it** - Your team is already familiar with Prisma
7. **Rich ecosystem** - Need integrations with specific tools that support Prisma

---

## 📊 Real-World Use Case: This Recipe Generator Project

### Why Drizzle Was Perfect Here:

```
Problem: 
❌ Prisma engine download failed (Artifactory issue)
❌ Corporate firewall blocked external CDN
❌ Windows machines needed native compilation
❌ Python not available on all dev machines

Solution with Drizzle:
✅ Pure JavaScript - works everywhere
✅ No external downloads needed
✅ Installed in seconds
✅ Same SQLite database format
✅ Lighter and faster
```

### Example in Your App:

```typescript
// In your Next.js API route
export async function GET() {
  const db = await getDb();
  
  const recipes = await db.select()
    .from(schema.recipes)
    .where(eq(schema.recipes.isSaved, true));
    
  return Response.json(recipes);
}

// In your React component
const addRecipe = async (recipeData) => {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
  return response.json();
};
```

---

## 🛠️ Useful Drizzle Commands

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit push

# Open database GUI (like Prisma Studio)
npx drizzle-kit studio

# Check what would change without applying
npx drizzle-kit check

# Drop everything and recreate (⚠️ DANGEROUS)
npx drizzle-kit drop
```

---

## 📝 Schema Changes Workflow

When you need to modify your database schema:

1. **Edit** `src/db/schema.ts`
   ```typescript
   // Add a new field
   export const recipes = sqliteTable('Recipe', {
     // ... existing fields
     difficulty: text('difficulty').notNull().default('medium'),
   });
   ```

2. **Generate migration**
   ```bash
   npx drizzle-kit generate
   ```

3. **Review the SQL** in `drizzle/000X_*.sql`
   ```sql
   ALTER TABLE Recipe ADD COLUMN difficulty TEXT DEFAULT 'medium' NOT NULL;
   ```

4. **Apply migration**
   ```bash
   npx drizzle-kit push
   ```

---

## 🎓 Key Takeaways

1. **Drizzle is a TypeScript ORM** - Write TypeScript, get SQL
2. **No native dependencies** - Perfect for corporate environments
3. **Lightweight and fast** - Great for modern web apps
4. **SQL-like syntax** - Easy if you know SQL
5. **Great for this project** - Solved the Prisma binary download issue

### The Bottom Line:
Drizzle gave us a working database solution in minutes without the headaches of binary downloads, Python dependencies, or Artifactory authentication. For this Recipe Generator project, it was the right tool at the right time! 🚀
