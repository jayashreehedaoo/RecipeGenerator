"use client";

import { updateShoppingListItem } from "@/app/shoppinglist/actions";
import { ShoppingListItem } from "@/db/schema";
import { getCategoryEmoji } from "@/lib/utils/inventory";
import { startTransition } from "react";

export const ShoppingListItems = ({
  items,
}: {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    purchased: boolean;
  }>;
}) => {
  const toggleItemPurchased = async (item: ShoppingListItem) => {
      item.purchased = !item.purchased;
      return new Promise<void>((resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await updateShoppingListItem({ ...item, expiryDate: undefined });
            if (result.success) {
              resolve();
            } else {
              reject(new Error(result.error));
            }
          } catch (error) {
            reject(error);
          }
        });
      });
    };

  return (
    <>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No items in this list</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-3 sm:p-4 transition-all ${
              item.purchased
                ? "bg-green-50 border-green-300"
                : "bg-white border-gray-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => toggleItemPurchased({ ...item, expiryDate: null })}
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer shrink-0"
              />
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl shrink-0">
                    {getCategoryEmoji(item.category)}
                  </span>
                  <span
                    className={`font-semibold text-sm sm:text-base truncate ${
                      item.purchased
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {item.quantity} {item.unit} • {item.category}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};
