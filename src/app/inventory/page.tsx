"use client";

import Header from "@/components/Inventory/Header";
import InventoryTable from "@/components/Inventory/InventoryTable";
import InventoryForm from "@/components/InventoryForm";
import { InventoryItem } from "@/types/inventory";
import { useEffect, useState } from "react";

const InventoryPage = () => {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]); // Original data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all"); // Track active filter
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set()); // For bulk delete
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null); // Sorting

  // Get emoji for category
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      Vegetables: "🥕",
      Fruits: "🍎",
      Protein: "🍗",
      Dairy: "🥛",
      Grains: "🌾",
      Oils: "🫒",
      Spices: "🌶️",
      Beverages: "☕",
    };
    return emojiMap[category] || "🍽️";
  };

  // Get expiry status color
  const getExpiryColor = (expiryDate: string): string => {
    const expiry = new Date(expiryDate);
    const current = new Date();
    const timeDiff = expiry.getTime() - current.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return "text-red-600 font-bold"; // Expired
    if (daysDiff <= 3) return "text-orange-600 font-semibold"; // Expiring very soon
    if (daysDiff <= 7) return "text-yellow-600"; // Expiring soon
    return "text-green-600"; // Fresh
  };

  // Apply filters and search
  const getFilteredAndSearchedItems = () => {
    let filtered = [...allItems];

    // Apply active filter
    if (activeFilter === "expiring") {
      filtered = filtered.filter((item) => {
        const expiryDate = new Date(item.expiryDate);
        const currentDate = new Date();
        const timeDiff = expiryDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 7 && daysDiff >= 0;
      });
    } else if (activeFilter === "lowstock") {
      filtered = filtered.filter(
        (item) => item.quantity > 0 && item.quantity <= 5
      );
    } else if (activeFilter === "outofstock") {
      filtered = filtered.filter((item) => item.quantity === 0);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[
          sortConfig.key as keyof InventoryItem
        ] as string | number;
        let bValue: string | number = b[
          sortConfig.key as keyof InventoryItem
        ] as string | number;

        if (sortConfig.key === "expiryDate") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (updatedItem: InventoryItem) => {
    if (isAddMode) {
      const newAllItems = [...allItems, updatedItem];
      setAllItems(newAllItems);
    } else {
      const updatedAllItems = allItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setAllItems(updatedAllItems);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    const updatedAllItems = allItems.filter((item) => item.id !== id);
    setAllItems(updatedAllItems);
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} item(s)?`)) return;

    const updatedAllItems = allItems.filter(
      (item) => !selectedItems.has(item.id)
    );
    setAllItems(updatedAllItems);
    setSelectedItems(new Set());
  };

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
    const displayed = getFilteredAndSearchedItems();
    if (selectedItems.size === displayed.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(displayed.map((item) => item.id)));
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return " ↕️";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  useEffect(() => {
    import("./../../mockdata/inventory.json").then((res) => {
      const items = res.default.inventory || res.default;
      setAllItems(items);
    });
  }, []);

  const displayedItems = getFilteredAndSearchedItems();

  // Helper function to get button classes
  const getButtonClass = (filterName: string) => {
    const baseClass = "border-2 rounded-xl p-1 transition-colors";
    const activeClass = "bg-blue-500 text-white border-blue-600";
    const inactiveClass = "bg-gray-200 border-gray-300 hover:text-blue-500";

    return `${baseClass} ${
      activeFilter === filterName ? activeClass : inactiveClass
    }`;
  };

  return (
    <div>
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
      />

      <InventoryTable 
        displayedItems={displayedItems}
        selectedItems={selectedItems}
        onClickUpdateItems={onClickUpdateItems}
        onClickDeleteItems={handleDelete}
        onToggleSelectItem={toggleSelectItem}
        onToggleSelectAll={toggleSelectAll}
        onSort={handleSort}
        getSortIcon={getSortIcon}
        getExpiryColor={getExpiryColor}
        getCategoryEmoji={getCategoryEmoji}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">
              {isAddMode ? "Add New Item" : "Edit Item"}
            </h2>
            <InventoryForm
              item={selectedItem}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
