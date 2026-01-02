"use client";

import { InventoryItem } from "@/db/schema";
import { InventoryFormProps } from "@/types/recipe-generator";
import { useEffect, useState } from "react";

const InventoryForm = ({
  item,
  onSave,
  onCancel,
  isAddMode,
}: InventoryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    unit: "pcs",
    category: "Vegetables",
    expiryDate: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form when editing or reset when adding
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        expiryDate: new Date(item.expiryDate).toISOString().split("T")[0],
      });
    } else {
      // Reset to defaults when adding new item
      setFormData({
        name: "",
        quantity: 1,
        unit: "pcs",
        category: "Vegetables",
        expiryDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        expiryDate: new Date(formData.expiryDate).getTime(),
        ...(item?.id ? { id: item.id } : {}),
        ...(item?.addedDate ? { addedDate: item.addedDate } : {}),
      } as InventoryItem);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common food item suggestions
  const commonItems = [
    // Vegetables
    "Tomatoes", "Onions", "Potatoes", "Carrots", "Broccoli", "Spinach", "Bell Peppers", "Cucumber", "Lettuce", "Garlic",
    "Ginger", "Cauliflower", "Cabbage", "Mushrooms", "Eggplant", "Zucchini", "Pumpkin", "Sweet Potato",
    // Fruits
    "Apples", "Bananas", "Oranges", "Grapes", "Strawberries", "Blueberries", "Mango", "Pineapple", "Watermelon",
    "Avocado", "Lemon", "Lime", "Peaches", "Pears", "Kiwi", "Papaya", "Pomegranate",
    // Dairy
    "Milk", "Cheese", "Butter", "Yogurt", "Cream", "Paneer", "Eggs", "Sour Cream",
    // Meat & Protein
    "Chicken Breast", "Chicken Thighs", "Ground Beef", "Pork Chops", "Salmon", "Tuna", "Shrimp", "Tofu", "Bacon",
    // Grains & Pasta
    "Rice", "Pasta", "Bread", "Flour", "Quinoa", "Oats", "Noodles", "Tortillas", "Couscous",
    // Pantry Items
    "Olive Oil", "Vegetable Oil", "Salt", "Pepper", "Sugar", "Honey", "Soy Sauce", "Vinegar", "Ketchup", "Mustard",
    // Beverages
    "Orange Juice", "Apple Juice", "Coffee", "Tea", "Soda", "Water",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Item Name *</label>
        <input
          type="text"
          list="item-suggestions"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Tomatoes"
          required
        />
        <datalist id="item-suggestions">
          {commonItems.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>

      {/* Quantity & Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit *</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="g">Grams</option>
            <option value="L">Liters</option>
            <option value="mL">Milliliters</option>
            <option value="oz">Ounces</option>
            <option value="lb">Pounds</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="Vegetables">🥕 Vegetables</option>
          <option value="Fruits">🍎 Fruits</option>
          <option value="Dairy">🥛 Dairy</option>
          <option value="Meat">🥩 Meat</option>
          <option value="Grains">🌾 Grains</option>
          <option value="Snacks">🍪 Snacks</option>
          <option value="Beverages">🥤 Beverages</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Expiry Date *</label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
          min={new Date().toISOString().split("T")[0]}
          max={new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // max year for 2 years
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isAddMode ? "Add Item" : "Update Item"}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
