"use client";

import RecipeCards from "@/components/Recipe/RecipeCards";
import Header from "@/components/Recipe/HeaderandFilters";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

const RecipePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    import("./../../mockdata/recipes.json").then((res) => {
      setRecipes(res.default.recipes || res.default);
    });
  }, []);

  const toggleSave = (id: string) => {
    setRecipes(
      recipes.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const getFilteredRecipes = (): Recipe[] => {
    let filtered = [...recipes];

    // Apply filter
    if (activeFilter === "saved") {
      filtered = filtered.filter((r) => r.isSaved);
    } else if (activeFilter === "ai") {
      filtered = filtered.filter((r) => r.source === "AI Generated");
    } else if (activeFilter !== "all") {
      filtered = filtered.filter(
        (r) => r.category.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.ingredients.some((i: string) =>
            i.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  };

  const displayedRecipes = getFilteredRecipes();

  return (
    <div>
      <Header
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <RecipeCards recipes={displayedRecipes} toggleSave={toggleSave} />
    </div>
  );
};

export default RecipePage;