import { useMemo, useState } from "react";
import type { InventoryItem } from "@/types/recipe-generator";

type FilterType = "all" | "expiring" | "lowstock" | "outofstock";
type SortConfig = { key: keyof InventoryItem; direction: "asc" | "desc" };

export function useInventoryFilters(items: InventoryItem[]) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Apply filter
    switch (activeFilter) {
      case "expiring":
        filtered = filtered.filter((item) => {
          const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate.toISOString());
          return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
        });
        break;
      case "lowstock":
        filtered = filtered.filter(
          (item) => item.quantity > 0 && item.quantity <= 5
        );
        break;
      case "outofstock":
        filtered = filtered.filter((item) => item.quantity === 0);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "expiryDate") {
          const aTime = new Date(aValue as string).getTime();
          const bTime = new Date(bValue as string).getTime();
          return sortConfig.direction === "asc"
            ? aTime - bTime
            : bTime - aTime;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, activeFilter, searchQuery, sortConfig]);

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return {
    filteredItems,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
  };
}

function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}