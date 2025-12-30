import { Recipe } from "@/types/recipe-generator";
import RecipeCard from "./RecipeCards/RecipeCard";
import Link from "next/link";

const RecipeCards = ({
  recipes,
  toggleSave,
  onEdit,
  onDelete,
}: {
  recipes: Recipe[];
  toggleSave: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          No recipes found
        </div>
      ) : (
        recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white block"
          >
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              toggleSave={toggleSave} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Link>
        ))
      )}
    </div>
  );
};

export default RecipeCards;
