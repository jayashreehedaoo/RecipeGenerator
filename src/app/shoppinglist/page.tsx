'use client';

import { useEffect, useState } from "react";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  estimatedPrice: number;
}

interface ShoppingList {
  id: string;
  scheduledFor: string;
  completed: boolean;
  createdAt: string;
  items: ShoppingItem[];
  totalEstimatedCost: number;
}

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);

  useEffect(() => {
    import("./../../mockdata/shoppingList.json").then((res) => {
      const lists = res.default.shoppingLists || res.default;
      setShoppingLists(lists);
      // Set the first incomplete list as active
      const current = lists.find((l: ShoppingList) => !l.completed) || lists[0];
      setActiveList(current);
    });
  }, []);

  const toggleItemPurchased = (itemId: string) => {
    if (!activeList) return;

    const updatedItems = activeList.items.map(item =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    );

    const updatedList = { ...activeList, items: updatedItems };
    setActiveList(updatedList);

    setShoppingLists(shoppingLists.map(list =>
      list.id === activeList.id ? updatedList : list
    ));
  };

  const markListComplete = () => {
    if (!activeList) return;

    const updatedList = { ...activeList, completed: true };
    setShoppingLists(shoppingLists.map(list =>
      list.id === activeList.id ? updatedList : list
    ));

    // Find next incomplete list
    const nextList = shoppingLists.find(l => l.id !== activeList.id && !l.completed);
    setActiveList(nextList || updatedList);
  };

  const getCategoryEmoji = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      "Vegetables": "🥕",
      "Fruits": "🍎",
      "Protein": "🍗",
      "Dairy": "🥛",
      "Grains": "🌾",
      "Oils": "🫒",
      "Spices": "🌶️",
      "Beverages": "☕",
    };
    return emojiMap[category] || "🛒";
  };

  if (!activeList) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading shopping lists...</p>
      </div>
    );
  }

  const purchasedCount = activeList.items.filter(i => i.purchased).length;
  const totalItems = activeList.items.length;
  const progress = totalItems > 0 ? (purchasedCount / totalItems) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Shopping List 🛒</h1>
        <p className="text-gray-600 mt-2">Manage your weekly shopping</p>
      </div>

      {/* List Selector */}
      {shoppingLists.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Shopping List:
          </label>
          <select
            value={activeList.id}
            onChange={(e) => {
              const list = shoppingLists.find(l => l.id === e.target.value);
              setActiveList(list || null);
            }}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {shoppingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {new Date(list.scheduledFor).toLocaleDateString()} - {list.completed ? "✓ Completed" : "Pending"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Shopping List Card */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {activeList.completed ? "✓ " : "📅 "}
              Shopping for {new Date(activeList.scheduledFor).toLocaleDateString()}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Created: {new Date(activeList.createdAt).toLocaleDateString()}
            </p>
          </div>
          {activeList.completed ? (
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
              ✓ Completed
            </span>
          ) : (
            <button
              onClick={markListComplete}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress: {purchasedCount} / {totalItems} items</span>
            <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Estimated Total Cost:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${activeList.totalEstimatedCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shopping Items */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold mb-3">Items to Buy</h3>
          {activeList.items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items in this list</p>
          ) : (
            activeList.items.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-all ${
                  item.purchased
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.purchased}
                    onChange={() => toggleItemPurchased(item.id)}
                    className="w-5 h-5 cursor-pointer"
                    disabled={activeList.completed}
                  />

                  {/* Item Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                      <span
                        className={`font-semibold ${
                          item.purchased ? "line-through text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.quantity} {item.unit} • {item.category}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                        item.purchased ? "text-gray-500" : "text-blue-600"
                      }`}
                    >
                      ${item.estimatedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {activeList.items.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-800">{totalItems}</div>
                <div className="text-xs text-gray-600">Total Items</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-700">{purchasedCount}</div>
                <div className="text-xs text-gray-600">Purchased</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-700">{totalItems - purchasedCount}</div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-700">{Math.round(progress)}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-purple-700 mb-2">💡 Shopping Tips</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Check your pantry before shopping to avoid duplicates</li>
          <li>• Shop for items expiring soon first to reduce waste</li>
          <li>• Your list auto-generates every Sunday based on inventory</li>
          <li>• Tap items to mark them as purchased while shopping</li>
        </ul>
      </div>
    </div>
  );
};

export default ShoppingListPage;