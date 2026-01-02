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
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'Halal',
  'Kosher',
];

export const CUISINE_OPTIONS = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Korean',
  'French',
  'Mediterranean',
  'American',
  'Greek',
  'Spanish',
  'Vietnamese',
  'Middle Eastern',
];

export const SHOPPING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
