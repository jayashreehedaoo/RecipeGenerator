import { Recipe } from "@/types/recipe";
import CardImage from "./CardImage";
import CardInfo from "./CardInfo";

const RecipeCard = ({
  recipe,
  toggleSave,
}: {
  recipe: Recipe;
  toggleSave: (id: string) => void;
}) => {
  return (
    <div
      className="border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white"
    >
      <CardImage />
      <CardInfo recipe={recipe} toggleSave={toggleSave} />
    </div>
  );
};

export default RecipeCard;
