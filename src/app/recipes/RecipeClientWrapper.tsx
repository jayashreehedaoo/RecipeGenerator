"use client";

import { useState, useTransition } from "react";
import RecipeCards from "@/components/Recipe/RecipeCards";
import RecipeForm from "@/components/Recipe/RecipeForm";
import HeaderandFilters from "@/components/Recipe/HeaderandFilters";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleSaveRecipe,
} from "./actions";
import { Recipe as DbRecipe } from "@/db/schema";
import { Recipe } from "@/types/recipe-generator";
import { AIRecipeModal } from "@/components/Recipe/AIRecipeModal";

interface RecipeClientWrapperProps {
  initialRecipes: DbRecipe[];
}

// Helper to convert DB recipe to component recipe
function dbToComponentRecipe(dbRecipe: DbRecipe): Recipe {
  return {
    id: dbRecipe.id,
    name: dbRecipe.name,
    ingredients: dbRecipe.ingredients.split("\n").filter((i) => i.trim()),
    instructions: dbRecipe.instructions.split("\n").filter((i) => i.trim()),
    prepTime: dbRecipe.prepTime,
    cookTime: dbRecipe.cookTime,
    servings: dbRecipe.servings,
    calories: dbRecipe.calories,
    category: dbRecipe.category,
    source: dbRecipe.source,
    isSaved: dbRecipe.isSaved,
    cuisine: dbRecipe.cuisine,
    createdAt: dbRecipe.createdAt,
    updatedAt: dbRecipe.updatedAt,
  };
}

// Helper to convert component recipe to DB format
function componentToDbRecipe(
  recipe: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">
): Omit<DbRecipe, "id" | "isSaved" | "createdAt" | "updatedAt"> {
  return {
    name: recipe.name,
    ingredients: recipe.ingredients.join("\n"),
    instructions: recipe.instructions.join("\n"),
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    calories: recipe.calories,
    category: recipe.category,
    source: recipe.source,
    cuisine: recipe.cuisine,
  };
}

export default function RecipeClientWrapper({
  initialRecipes,
}: RecipeClientWrapperProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(
    initialRecipes.map(dbToComponentRecipe)
  );
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
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
  const handleAddRecipe = async (
    recipeData: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">
  ) => {
    startTransition(async () => {
      try {
        const dbRecipe = await createRecipe(componentToDbRecipe(recipeData));
        const componentRecipe = dbToComponentRecipe(dbRecipe);
        setRecipes((prev) => [componentRecipe, ...prev]);
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

  const handleUpdateRecipe = async (
    recipeData: Omit<Recipe, "id" | "isSaved" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedRecipe) return;

    startTransition(async () => {
      try {
        const dbRecipe = await updateRecipe(
          selectedRecipe.id,
          componentToDbRecipe(recipeData)
        );
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === dbRecipe.id ? dbToComponentRecipe(dbRecipe) : r
          )
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
          prev.map((r) =>
            r.id === dbRecipe.id ? dbToComponentRecipe(dbRecipe) : r
          )
        );
      } catch (error) {
        console.error("Failed to toggle save:", error);
        alert("Failed to save recipe. Please try again.");
      }
    });
  };

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const selectedCategory = activeFilter;
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "saved" && recipe.isSaved) ||
      (selectedCategory === "ai" && recipe.source === "AI Generated") ||
      recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "name":
        return a.name.localeCompare(b.name);
      case "quickest":
        return (a.prepTime || 0) - (b.prepTime || 0);
      case "calories":
        return (a.calories || 0) - (b.calories || 0);
      default:
        return 0;
    }
  });

  const addRecipeModal = showAddModal && (
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
  );

  const editRecipeModal = showEditModal && selectedRecipe && (
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
  );

  // ✅ Empty state
  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Recipes Yet
          </h2>
          <p className="text-gray-600 mb-6">Start adding recipes by clicking the button below.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Recipe
          </button>
        </div>
        {addRecipeModal}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filters */}
        <HeaderandFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Sort Controls & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="quickest">Quickest</option>
              <option value="calories">Lowest Calories</option>
            </select>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">✨</span>
              <span className="hidden sm:inline">AI Recipe</span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">+</span>
              <span className="hidden sm:inline">Add Recipe</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
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
          recipes={sortedRecipes}
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

        {addRecipeModal}

        <AIRecipeModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onSuccess={() => {
            // Refresh page to show new recipe
            window.location.reload();
          }}
        />

        {editRecipeModal}
      </div>
    </div>
  );
}
