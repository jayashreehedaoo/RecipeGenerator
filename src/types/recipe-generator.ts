// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: Date;
  addedDate: Date;
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
  createdAt: string;
}
export interface RecipeCardsProps {
  recipes: Recipe[];
  toggleSave: (id: string) => void;
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

