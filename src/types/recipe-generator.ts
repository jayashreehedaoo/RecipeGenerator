// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: number;
  addedDate: number;
}
export interface InventoryFormProps {
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
  isAddMode: boolean;
}

// Recipe
export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  servings: number;
  prepTime: number;
  cookTime: number;
  imageUrl?: string;
  category: string;
  source: string;
  isSaved: boolean;
  createdAt: number;
  updatedAt: number;
  cuisine: string;
}
export interface RecipeCardsProps {
  recipes: Recipe[];
  toggleSave: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

//ShoppingCart
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  expiryDate?: number;
}

export interface UserPreferences {
  id?: string;
  userId?: string;
  // Dietary Preferences
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteCuisines: string[];
  dislikedIngredients: string[];

  // Default Settings
  servingsDefault: number;

  // Shopping Preferences
  shoppingDay: string;
  lowStockThreshold: number;
  expiryWarningDays: number;

  // Notification Settings
  expiryAlerts: boolean;
  lowStockAlerts: boolean;
  shoppingReminders: boolean;
  recipeSuggestions: boolean;
}

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Pescatarian",
  "Keto",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Protein-Rich",
];

export const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Korean",
  "French",
  "Mediterranean",
  "American",
  "Greek",
  "Spanish",
  "Vietnamese",
  "Middle Eastern",
];

export const SHOPPING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type RecipeFormData = Omit<
  Recipe,
  "id" | "isSaved" | "createdAt" | "updatedAt"
>;
export type InventoryFormData = Omit<InventoryItem, "id" | "addedDate">;
export type ShoppingListFormData = Omit<ShoppingListItem, "id" | "purchased">;
