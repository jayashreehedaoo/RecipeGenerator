// Get emoji for category
export const getCategoryEmoji = (category: string): string => {
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
export const getExpiryColor = (expiryDate: string): string => {
  const expiry = new Date(expiryDate);
  const current = new Date();
  const timeDiff = expiry.getTime() - current.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) return "text-red-600 font-bold"; // Expired
  if (daysDiff <= 3) return "text-orange-600 font-semibold"; // Expiring very soon
  if (daysDiff <= 7) return "text-yellow-600"; // Expiring soon
  return "text-green-600"; // Fresh
};

// Helper function to get button classes
export const getButtonClass = (filterName: string, activeFilter: string) => {
  const baseClass = "border-2 rounded-xl p-1 transition-colors";
  const activeClass = "bg-blue-500 text-white border-blue-600";
  const inactiveClass = "bg-gray-200 border-gray-300 hover:text-blue-500";

  return `${baseClass} ${
    activeFilter === filterName ? activeClass : inactiveClass
  }`;
};

export const getSortIcon = (key: string, sortConfig: { key: string; direction: "asc" | "desc" } | null) => {
  if (!sortConfig || sortConfig.key !== key) return " ↕️";
  return sortConfig.direction === "asc" ? " ↑" : " ↓";
};
