"use client";

import { useState, useTransition } from "react";
import RecipeCards from "@/components/Recipe/RecipeCards";
import RecipeForm from "@/components/Recipe/RecipeForm";
import HeaderandFilters from "@/components/Recipe/HeaderandFilters";
import { createRecipe, updateRecipe, deleteRecipe, toggleSaveRecipe } from "./actions";

// Database recipe type (ingredients/instructions as strings)
interface DbRecipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  category: string;
  source: string;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Component recipe type (ingredients/instructions as arrays)
interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  category: string;
  source: string;
  isSaved: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface RecipeClientWrapperProps {
  initialRecipes: DbRecipe[];
}

// Helper to convert DB recipe to component recipe
function dbToComponentRecipe(dbRecipe: DbRecipe): Recipe {
  return {
    ...dbRecipe,
    ingredients: dbRecipe.ingredients.split('\n').filter(i => i.trim()),
    instructions: dbRecipe.instructions.split('\n').filter(i => i.trim()),
  };
}

// Helper to convert component recipe to DB format
function componentToDbRecipe(recipe: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">): Omit<DbRecipe, "id" | "isSaved" | "createdAt" | "updatedAt"> {
  return {
    ...recipe,
    ingredients: recipe.ingredients.join('\n'),
    instructions: recipe.instructions.join('\n'),
  };
}

export default function RecipeClientWrapper({ initialRecipes }: RecipeClientWrapperProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(
    initialRecipes.map(dbToComponentRecipe)
  );
  const [isPending, startTransition] = useTransition();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Handle Add Recipe
  const handleAddRecipe = async (recipeData: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">) => {
    startTransition(async () => {
      try {
        const dbRecipe = await createRecipe(componentToDbRecipe(recipeData));
        setRecipes((prev) => [dbToComponentRecipe(dbRecipe), ...prev]);
        setShowAddModal(false);
      } catch (error) {
        console.error("Failed to add recipe:", error);
        alert("Failed to add recipe. Please try again.");
      }
    });
  };

  // Handle Edit Recipe
  const handleEditClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = async (recipeData: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">) => {
    if (!selectedRecipe) return;

    startTransition(async () => {
      try {
        const dbRecipe = await updateRecipe(selectedRecipe.id, componentToDbRecipe(recipeData));
        setRecipes((prev) =>
          prev.map((r) => (r.id === dbRecipe.id ? dbToComponentRecipe(dbRecipe) : r))
        );
        setShowEditModal(false);
        setSelectedRecipe(null);
      } catch (error) {
        console.error("Failed to update recipe:", error);
        alert("Failed to update recipe. Please try again.");
      }
    });
  };

  // Handle Delete Recipe
  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    startTransition(async () => {
      try {
        await deleteRecipe(id);
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Failed to delete recipe:", error);
        alert("Failed to delete recipe. Please try again.");
      }
    });
  };

  // Handle Toggle Save Recipe
  const handleToggleSave = async (id: string) => {
    startTransition(async () => {
      try {
        const dbRecipe = await toggleSaveRecipe(id);
        setRecipes((prev) =>
          prev.map((r) => (r.id === dbRecipe.id ? dbToComponentRecipe(dbRecipe) : r))
        );
      } catch (error) {
        console.error("Failed to toggle save:", error);
        alert("Failed to save recipe. Please try again.");
      }
    });
  };

  // Filter and Sort Recipes
  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Handle filter logic
      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "saved") return matchesSearch && recipe.isSaved;
      if (activeFilter === "ai") return matchesSearch && recipe.source === "AI Generated";
      return matchesSearch && recipe.category === activeFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "quickest":
          return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
        case "calories":
          return a.calories - b.calories;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filters */}
        <HeaderandFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Sort Controls & Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="quickest">Quickest</option>
              <option value="calories">Lowest Calories</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Recipe
          </button>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Updating recipes...</p>
          </div>
        )}

        {/* Recipe Cards */}
        <RecipeCards
          recipes={filteredRecipes}
          toggleSave={handleToggleSave}
          onEdit={handleEditClick}
          onDelete={handleDeleteRecipe}
        />

        {/* No Results */}
        {filteredRecipes.length === 0 && !isPending && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No recipes found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Your First Recipe
            </button>
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 z-10">
                <h2 className="text-2xl font-bold text-gray-800">Add New Recipe</h2>
              </div>
              <div className="p-6">
                <RecipeForm
                  recipe={null}
                  onSave={handleAddRecipe}
                  onCancel={() => setShowAddModal(false)}
                  isAddMode={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Recipe Modal */}
        {showEditModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 z-10">
                <h2 className="text-2xl font-bold text-gray-800">Edit Recipe</h2>
              </div>
              <div className="p-6">
                <RecipeForm
                  recipe={selectedRecipe}
                  onSave={handleUpdateRecipe}
                  onCancel={() => {
                    setShowEditModal(false);
                    setSelectedRecipe(null);
                  }}
                  isAddMode={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
