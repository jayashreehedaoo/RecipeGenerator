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
    <div className="overflow-x-auto">
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
                    item.expiryDate.toISOString().split('T')[0]
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
  );
}
