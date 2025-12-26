'use client';

import { InventoryItem } from "@/types/inventory";
import { useState } from "react";

interface InventoryFormProps {
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

const InventoryForm = ({ item, onSave, onCancel }: InventoryFormProps) => {
  const [formData, setFormData] = useState<InventoryItem>(
    item || {
      id: Date.now().toString(),
      name: "",
      quantity: 0,
      unit: "kg",
      category: "Vegetables",
      expiryDate: "",
      addedDate: new Date().toISOString().split("T")[0],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Item Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          step="0.1"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Unit</label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="ml">ml</option>
          <option value="pieces">pieces</option>
          <option value="loaves">loaves</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Protein">Protein</option>
          <option value="Dairy">Dairy</option>
          <option value="Grains">Grains</option>
          <option value="Oils">Oils</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;