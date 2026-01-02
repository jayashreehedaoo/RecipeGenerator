'use client';

import { useState, useTransition } from "react";
import { InventoryItem } from "@/types/recipe-generator";
import Header from "@/components/Inventory/Header";
import InventoryTable from "@/components/Inventory/InventoryTable";
import InventoryForm from "@/components/Inventory/InventoryForm";
import { useInventoryFilters } from "@/lib/hooks/useInventoryFilters";
import {
  getButtonClass,
  getCategoryEmoji,
  getExpiryColor,
  getSortIcon,
} from "@/lib/utils/inventory";
import {
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  bulkDeleteInventoryItems,
} from "./actions";

export function InventoryClientWrapper({ initialItems }: { initialItems: InventoryItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // ✅ Filtering & sorting
  const {
    filteredItems,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
  } = useInventoryFilters(initialItems);

  // Filter handlers
  const onClickExpirySoon = () => {
    setActiveFilter("expiring");
    setSelectedItems(new Set());
  };

  const onClickAllItems = () => {
    setActiveFilter("all");
    setSelectedItems(new Set());
  };

  const onClickLowStock = () => {
    setActiveFilter("lowstock");
    setSelectedItems(new Set());
  };

  const onClickOutOfStock = () => {
    setActiveFilter("outofstock");
    setSelectedItems(new Set());
  };

  // Modal handlers
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const onClickAddItems = () => {
    setIsAddMode(true);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const onClickUpdateItems = (item: InventoryItem) => {
    setIsAddMode(false);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ✅ CRUD handlers using Server Actions
  const handleSave = async (itemData: Omit<InventoryItem, "id" | "addedDate">) => {
    const formData = new FormData();
    formData.append('name', itemData.name);
    formData.append('quantity', itemData.quantity.toString());
    formData.append('unit', itemData.unit);
    formData.append('category', itemData.category);
    formData.append('expiryDate', new Date(itemData.expiryDate).toISOString());

    startTransition(async () => {
      try {
        let result;
        if (isAddMode) {
          result = await createInventoryItem(formData);
        } else if (selectedItem) {
          result = await updateInventoryItem(selectedItem.id, formData);
        }

        if (result?.success) {
          closeModal();
          setSelectedItems(new Set());
        } else {
          alert(result?.error || 'Failed to save item');
        }
      } catch (error) {
        console.error('Failed to save item:', error);
        alert('Failed to save item. Please try again.');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    startTransition(async () => {
      try {
        const result = await deleteInventoryItem(id);
        if (result.success) {
          setSelectedItems(new Set());
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert("Please select items to delete.");
      return;
    }

    if (!confirm(`Delete ${selectedItems.size} item(s)?`)) return;

    startTransition(async () => {
      try {
        const result = await bulkDeleteInventoryItems(Array.from(selectedItems));
        if (result.success) {
          setSelectedItems(new Set());
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error('Failed to delete items:', error);
        alert('Failed to delete some items. Please try again.');
      }
    });
  };

  // Selection handlers
  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
    }
  };

  // ✅ Empty state
  if (initialItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items Yet</h2>
          <p className="text-gray-600 mb-6">
            Start building your inventory by adding your first item.
          </p>
          <button
            onClick={onClickAddItems}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Show loading overlay during transitions */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <Header
          selectedItems={selectedItems}
          onClickAddItems={onClickAddItems}
          onClickExpirySoon={onClickExpirySoon}
          onClickAllItems={onClickAllItems}
          onClickLowStock={onClickLowStock}
          onClickOutOfStock={onClickOutOfStock}
          handleBulkDelete={handleBulkDelete}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          getButtonClass={getButtonClass}
          activeFilter={activeFilter}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Items Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={onClickAllItems}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <InventoryTable
            displayedItems={filteredItems}
            selectedItems={selectedItems}
            onClickUpdateItems={onClickUpdateItems}
            onClickDeleteItems={handleDelete}
            onToggleSelectItem={toggleSelectItem}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getExpiryColor={getExpiryColor}
            getCategoryEmoji={getCategoryEmoji}
            sortConfig={sortConfig}
          />
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {isAddMode ? "Add New Item" : "Edit Item"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <InventoryForm
              item={selectedItem}
              onSave={handleSave}
              onCancel={closeModal}
              isAddMode={isAddMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}