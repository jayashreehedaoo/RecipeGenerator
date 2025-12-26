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