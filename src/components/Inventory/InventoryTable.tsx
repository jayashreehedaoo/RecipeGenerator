import { InventoryItem } from "@/types/recipe-generator";

export default function InventoryTable({
  displayedItems,
  selectedItems,
  onClickUpdateItems,
  onClickDeleteItems,
  onToggleSelectItem,
  onToggleSelectAll,
  onSort,
  getSortIcon,
  getExpiryColor,
  getCategoryEmoji,
  sortConfig,
}: {
  displayedItems: InventoryItem[];
  selectedItems: Set<string>;
  onClickUpdateItems: (item: InventoryItem) => void;
  onClickDeleteItems: (id: string) => void;
  onToggleSelectItem: (id: string) => void;
  onToggleSelectAll: () => void;
  onSort: (field: keyof InventoryItem) => void;
  getSortIcon: (field: keyof InventoryItem, sortConfig: { key: string; direction: "asc" | "desc" } | null) => React.ReactNode;
  getExpiryColor: (expiryDate: string) => string;
  getCategoryEmoji: (category: string) => string;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
}) {
  return (
    <>
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.size === displayedItems.length &&
                    displayedItems.length > 0
                  }
                  onChange={onToggleSelectAll}
                  className="cursor-pointer w-4 h-4"
                />
              </th>
              <th
                className="px-4 py-2 border cursor-pointer hover:bg-gray-300"
                onClick={() => onSort("name")}
              >
                Item {getSortIcon("name", sortConfig)}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer hover:bg-gray-300"
                onClick={() => onSort("quantity")}
              >
                Quantity {getSortIcon("quantity", sortConfig)}
              </th>
              <th className="px-4 py-2 border">Unit</th>
              <th
                className="px-4 py-2 border cursor-pointer hover:bg-gray-300"
                onClick={() => onSort("expiryDate")}
              >
                Expiration Date {getSortIcon("expiryDate", sortConfig)}
              </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              displayedItems.map((item: InventoryItem) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-100 ${
                    selectedItems.has(item.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => onToggleSelectItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td
                    className="border px-4 py-2 cursor-pointer hover:text-blue-600"
                    onDoubleClick={() => onClickUpdateItems(item)}
                  >
                    {getCategoryEmoji(item.category)} {item.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border px-4 py-2 text-center">{item.unit}</td>
                  <td
                    className={`border px-4 py-2 text-center ${getExpiryColor(
                      new Date(item.expiryDate).toISOString().split('T')[0]
                    )}`}
                  >
                    {new Date(item.expiryDate).toLocaleDateString('en-In', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => onClickUpdateItems(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onClickDeleteItems(item.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="lg:hidden space-y-4">
        {/* Select All Mobile */}
        {displayedItems.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedItems.size === displayedItems.length &&
                  displayedItems.length > 0
                }
                onChange={onToggleSelectAll}
                className="cursor-pointer w-5 h-5"
              />
              <span className="font-medium text-gray-700">
                Select All ({selectedItems.size}/{displayedItems.length})
              </span>
            </label>
          </div>
        )}

        {displayedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            <p className="text-lg">No items found</p>
          </div>
        ) : (
          displayedItems.map((item: InventoryItem) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md p-4 ${
                selectedItems.has(item.id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {/* Card Header with Checkbox and Actions */}
              <div className="flex items-start justify-between mb-3">
                <label className="flex items-start gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => onToggleSelectItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer w-5 h-5 mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getCategoryEmoji(item.category)} {item.name}
                    </h3>
                    <span className="text-sm text-gray-500 capitalize">
                      {item.category}
                    </span>
                  </div>
                </label>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => onClickUpdateItems(item)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => onClickDeleteItems(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quantity</p>
                  <p className="text-base font-semibold text-gray-800">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                  <p
                    className={`text-base font-semibold ${getExpiryColor(
                      new Date(item.expiryDate).toISOString().split('T')[0]
                    )}`}
                  >
                    {new Date(item.expiryDate).toLocaleDateString('en-In', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
