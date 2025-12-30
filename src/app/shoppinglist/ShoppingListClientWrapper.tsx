import ProgressBar from "@/components/ShoppingList/ProgressBar";
import ShoppingList from "@/components/ShoppingList/ShoppingList";
import { ShoppingListItems } from "@/components/ShoppingList/ShoppingListItems";
import { ShoppingListItem } from "@/db/schema";

export default function ShoppingListClientWrapper({
  items,
}: {
  items: ShoppingListItem[];
}) {
  const purchasedCount = items.filter((i) => i.purchased).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? (purchasedCount / totalItems) * 100 : 0;

  return (
    <>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
        <ProgressBar
          progress={progress}
          purchasedCount={purchasedCount}
          totalItems={totalItems}
        />
        <ShoppingList />
        <ShoppingListItems items={items} />
      </div>
    </>
  );
}
