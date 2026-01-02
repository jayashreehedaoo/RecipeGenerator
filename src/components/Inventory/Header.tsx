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
  activeFilter,
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
  getButtonClass: (filter: string, activeFilter: string) => string;
  activeFilter: string;
}) {
  return (
    <>
      {/* Action Buttons - Mobile First */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`${getButtonClass("expiring", activeFilter)} text-sm sm:text-base`}
            onClick={onClickExpirySoon}
          >
            <span className="hidden sm:inline">⏰ Expiring soon</span>
            <span className="sm:hidden">⏰ Expiring</span>
          </button>
          <button
            className={`${getButtonClass("all", activeFilter)} text-sm sm:text-base`}
            onClick={onClickAllItems}
          >
            <span className="hidden sm:inline">📋 All items</span>
            <span className="sm:hidden">📋 All</span>
          </button>
          <button
            className={`${getButtonClass("lowstock", activeFilter)} text-sm sm:text-base`}
            onClick={onClickLowStock}
          >
            <span className="hidden sm:inline">⚠️ Low stock</span>
            <span className="sm:hidden">⚠️ Low</span>
          </button>
          <button
            className={`${getButtonClass("outofstock", activeFilter)} text-sm sm:text-base`}
            onClick={onClickOutOfStock}
          >
            <span className="hidden sm:inline">❌ Out of stock</span>
            <span className="sm:hidden">❌ Out of stock</span>
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {selectedItems.size > 0 && (
            <button
              className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm sm:text-base flex-1 sm:flex-none"
              onClick={handleBulkDelete}
            >
              🗑️ Delete ({selectedItems.size})
            </button>
          )}
          <button
            className="hover:text-blue-500 border-green-300 border-2 bg-green-200 rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-none whitespace-nowrap"
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
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>
    </>
  );
}
