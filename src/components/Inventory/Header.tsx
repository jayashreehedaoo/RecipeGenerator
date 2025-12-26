export default function Header({
  selectedItems,
  onClickAddItems,
  onClickExpirySoon,
  onClickAllItems,
  onClickLowStock,
  onClickOutOfStock,
  handleBulkDelete,
  searchQuery,
  setSearchQuery,
  getButtonClass,
}: {
  selectedItems: Set<string>;
  onClickAddItems: () => void;
  onClickExpirySoon: () => void;
  onClickAllItems: () => void;
  onClickLowStock: () => void;
  onClickOutOfStock: () => void;
  handleBulkDelete: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getButtonClass: (filter: string) => string;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className={getButtonClass("expiring")}
            onClick={onClickExpirySoon}
          >
            ⏰ Expiring soon
          </button>
          <button
            className={`${getButtonClass("all")}`}
            onClick={onClickAllItems}
          >
            📋 All items
          </button>
          <button
            className={`${getButtonClass("lowstock")}`}
            onClick={onClickLowStock}
          >
            ⚠️ Low stock
          </button>
          <button
            className={`${getButtonClass("outofstock")}`}
            onClick={onClickOutOfStock}
          >
            ❌ Out of stock
          </button>
        </div>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              onClick={handleBulkDelete}
            >
              🗑️ Delete ({selectedItems.size})
            </button>
          )}
          <button
            className="hover:text-blue-500 border-green-300 border-2 bg-green-200 rounded-xl px-4 py-2"
            onClick={onClickAddItems}
          >
            ➕ Add items
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
}
