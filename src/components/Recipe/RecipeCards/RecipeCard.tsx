import { Recipe } from "@/types/recipe-generator";
import CardImage from "./CardImage";
import CardInfo from "./CardInfo";

const RecipeCard = ({
  recipe,
  toggleSave,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  toggleSave: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
}) => {
  return (
    <div
      className="border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white"
    >
      <CardImage />
      <CardInfo 
        recipe={recipe} 
        toggleSave={toggleSave}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default RecipeCard;
