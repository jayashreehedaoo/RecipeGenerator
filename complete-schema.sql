-- Complete Database Schema for Recipe Generator App
-- Run this to recreate all tables in Turso

-- ============================================
-- Table: Recipe
-- ============================================
CREATE TABLE IF NOT EXISTS Recipe (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prepTime INTEGER NOT NULL,
    cookTime INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    calories INTEGER NOT NULL,
    category TEXT NOT NULL,
    source TEXT NOT NULL,
    isSaved INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch()),
    cuisine TEXT NOT NULL DEFAULT 'Unknown'
);

-- ============================================
-- Table: InventoryItem
-- ============================================
CREATE TABLE IF NOT EXISTS InventoryItem (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    expiryDate INTEGER NOT NULL,
    addedDate INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================
-- Table: ShoppingListItem
-- ============================================
CREATE TABLE IF NOT EXISTS ShoppingListItem (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    purchased INTEGER NOT NULL DEFAULT 0,
    expiryDate INTEGER
);

-- ============================================
-- Table: UserPreferences
-- ============================================
CREATE TABLE IF NOT EXISTS UserPreferences (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL DEFAULT 'default-user',
    dietaryRestrictions TEXT NOT NULL DEFAULT '',
    allergies TEXT NOT NULL DEFAULT '',
    favoriteCuisines TEXT NOT NULL DEFAULT '',
    dislikedIngredients TEXT NOT NULL DEFAULT '',
    servingsDefault INTEGER NOT NULL DEFAULT 4,
    shoppingDay TEXT NOT NULL DEFAULT 'Sunday',
    lowStockThreshold INTEGER NOT NULL DEFAULT 20,
    expiryWarningDays INTEGER NOT NULL DEFAULT 3,
    expiryAlerts INTEGER NOT NULL DEFAULT 1,
    lowStockAlerts INTEGER NOT NULL DEFAULT 1,
    shoppingReminders INTEGER NOT NULL DEFAULT 1,
    recipeSuggestions INTEGER NOT NULL DEFAULT 1,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================
-- Indexes (Optional - for better performance)
-- ============================================

-- Recipe indexes
CREATE INDEX IF NOT EXISTS idx_recipe_category ON Recipe(category);
CREATE INDEX IF NOT EXISTS idx_recipe_isSaved ON Recipe(isSaved);
CREATE INDEX IF NOT EXISTS idx_recipe_createdAt ON Recipe(createdAt);

-- InventoryItem indexes
CREATE INDEX IF NOT EXISTS idx_inventory_category ON InventoryItem(category);
CREATE INDEX IF NOT EXISTS idx_inventory_expiryDate ON InventoryItem(expiryDate);

-- ShoppingListItem indexes
CREATE INDEX IF NOT EXISTS idx_shopping_purchased ON ShoppingListItem(purchased);
CREATE INDEX IF NOT EXISTS idx_shopping_category ON ShoppingListItem(category);

-- UserPreferences indexes
CREATE INDEX IF NOT EXISTS idx_preferences_userId ON UserPreferences(userId);
