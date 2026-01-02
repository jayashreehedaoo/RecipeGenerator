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
    const confirmed = confirm('Your current shopping cart will be deleted. Are you sure you want to create a new cart?');
    if (confirmed) {
      await bulkDeleteShoppingListItems();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shopping List 🛒</h1>
        <div className="flex gap-2 sm:gap-4">
          <button
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
            onClick={createNewCart}
          >
            <span className="hidden sm:inline">Create a </span>New Cart
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <span className="text-lg sm:text-xl">+</span>
            Add<span className="hidden sm:inline"> Item</span>
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
