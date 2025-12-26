'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
  addedDate: string;
}

interface Recipe {
  id: string;
  name: string;
  calories: number;
  servings: number;
  category: string;
  source: string;
  isSaved: boolean;
  createdAt: string;
}

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  estimatedPrice: number;
}

interface ShoppingList {
  id: string;
  scheduledFor: string;
  completed: boolean;
  items: ShoppingListItem[];
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    // Load all data
    Promise.all([
      import("./../mockdata/inventory.json"),
      import("./../mockdata/recipes.json"),
      import("./../mockdata/shoppingList.json")
    ]).then(([invRes, recRes, shopRes]) => {
      setInventory(invRes.default.inventory || invRes.default);
      setRecipes(recRes.default.recipes || recRes.default);
      setShoppingLists(shopRes.default.shoppingLists || shopRes.default);
    });
  }, []);

  // Calculate stats
  const totalItems = inventory.length;
  const savedRecipes = recipes.filter(r => r.isSaved).length;
  
  const expiringItems = inventory.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    const currentDate = new Date();
    const timeDiff = expiryDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff >= 0;
  });

  const lowStockItems = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= 5
  );

  const nextShoppingList = shoppingLists.find(s => !s.completed);
  const recentRecipes = recipes.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Recipe Generator! 👨‍🍳</h1>
        <p className="mt-2 text-gray-600">Manage your inventory and generate delicious recipes based on what you have.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-blue-700">{totalItems}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>

        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6">
          <div className="text-3xl mb-2">⏰</div>
          <div className="text-2xl font-bold text-red-700">{expiringItems.length}</div>
          <div className="text-sm text-gray-600">Expiring Soon</div>
        </div>

        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-yellow-700">{lowStockItems.length}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>

        <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6">
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-2xl font-bold text-green-700">{savedRecipes}</div>
          <div className="text-sm text-gray-600">Saved Recipes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/inventory" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-semibold">Manage Inventory</div>
          </Link>
          <Link href="/recipes" className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="text-3xl mb-2">🍳</div>
            <div className="font-semibold">Generate Recipe</div>
          </Link>
          <Link href="/shoppinglist" className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="text-3xl mb-2">🛒</div>
            <div className="font-semibold">Shopping List</div>
          </Link>
        </div>
      </div>

      {/* Alerts Section */}
      {(expiringItems.length > 0 || lowStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expiringItems.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-700 mb-3">⏰ Expiring Soon</h3>
              <div className="space-y-2">
                {expiringItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-red-600 font-semibold">{item.expiryDate}</span>
                  </div>
                ))}
              </div>
              {expiringItems.length > 5 && (
                <Link href="/inventory" className="text-red-600 text-sm mt-2 inline-block hover:underline">
                  View all {expiringItems.length} items →
                </Link>
              )}
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-700 mb-3">⚠️ Low Stock</h3>
              <div className="space-y-2">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-yellow-600 font-semibold">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
              {lowStockItems.length > 5 && (
                <Link href="/inventory" className="text-yellow-600 text-sm mt-2 inline-block hover:underline">
                  View all {lowStockItems.length} items →
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next Shopping Day */}
      {nextShoppingList && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-700 mb-2">🛒 Next Shopping Day</h3>
          <p className="text-lg">
            Scheduled for: <span className="font-bold">{new Date(nextShoppingList.scheduledFor).toLocaleDateString()}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">{nextShoppingList.items.length} items in your list</p>
          <Link href="/shoppinglist" className="text-purple-600 text-sm mt-2 inline-block hover:underline">
            View shopping list →
          </Link>
        </div>
      )}

      {/* Recent Recipes */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🍳 Recent Recipes</h2>
          <Link href="/recipes" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentRecipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🔥 {recipe.calories} calories</p>
                <p>🍽️ Serves {recipe.servings}</p>
                <p>📂 {recipe.category}</p>
                <p className="text-xs text-gray-500">Source: {recipe.source}</p>
              </div>
              {recipe.isSaved && (
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ❤️ Saved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
