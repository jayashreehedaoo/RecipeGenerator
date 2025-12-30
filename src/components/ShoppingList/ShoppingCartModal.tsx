"use client";

import { ShoppingListItem } from "@/types/recipe-generator";
import { useState } from "react";

export default function AddItemModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (item: Omit<ShoppingListItem, "id">) => Promise<void>; }) {
  const [formData, setFormData] = useState<Omit<ShoppingListItem, "id">>({
    name: "",
    quantity: 1,
    unit: "pcs",
    category: "Vegetables",
    purchased: false,});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAdd(formData);
      // Reset form on success
      setFormData({
        name: "",
        quantity: 1,
        unit: "pcs",
        category: "Vegetables",
        purchased: false,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form on close
      setFormData({
        name: "",
        quantity: 1,
        unit: "pcs",
        category: "Vegetables",
        purchased: false,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Item to Cart 🛒
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
            disabled={isSubmitting}
          >
            Close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Tomatoes, Milk, Bread"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="L">Liters</option>
                <option value="mL">Milliliters</option>
                <option value="oz">Ounces</option>
                <option value="lb">Pounds</option>
                <option value="dozen">Dozen</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            >
              <option value="Vegetables">🥕 Vegetables</option>
              <option value="Fruits">🍎 Fruits</option>
              <option value="Dairy">🥛 Dairy</option>
              <option value="Meat">🥩 Meat</option>
              <option value="Grains">🌾 Grains</option>
              <option value="Snacks">🍪 Snacks</option>
              <option value="Beverages">🥤 Beverages</option>
              <option value="Bakery">🍞 Bakery</option>
              <option value="Frozen">🧊 Frozen</option>
              <option value="Condiments">🧂 Condiments</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Adding...
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}