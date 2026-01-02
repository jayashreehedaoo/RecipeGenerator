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

export type RecipeFormData = Omit<Recipe, 'id' | 'isSaved' | 'createdAt' | 'updatedAt'>;
export type InventoryFormData = Omit<InventoryItem, 'id' | 'addedDate'>;
export type ShoppingListFormData = Omit<ShoppingListItem, 'id' | 'purchased'>;