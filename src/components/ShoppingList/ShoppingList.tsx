"use client";

import { addShoppingListItem, bulkDeleteShoppingListItems } from "@/app/shoppinglist/actions";
import { useState, useTransition } from "react";
import AddItemModal from "./ShoppingCartModal";
import { ShoppingListItem } from "@/types/recipe-generator";

export default function ShoppingList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddItem = async (itemData: Omit<ShoppingListItem, "id">) => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await addShoppingListItem(itemData);
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

  const createNewCart = async () => {
    await bulkDeleteShoppingListItems();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shopping List</h1>
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            onClick={createNewCart}
          >
            Create a New Cart
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
          >
            <span className="text-xl">+</span>
            Add Item
          </button>
        </div>
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
