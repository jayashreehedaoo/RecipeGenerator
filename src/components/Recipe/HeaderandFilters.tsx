const Header = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const getButtonClass = (filterName: string) => {
    const baseClass = "border-2 rounded-xl px-4 py-2 transition-colors";
    const activeClass = "bg-blue-500 text-white border-blue-600";
    const inactiveClass = "bg-gray-200 border-gray-300 hover:text-blue-500";

    return `${baseClass} ${
      activeFilter === filterName ? activeClass : inactiveClass
    }`;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Recipes 🍳</h1>
        <p className="text-gray-600 mt-2">
          Browse and manage your recipe collection
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={getButtonClass("all")}
          onClick={() => setActiveFilter("all")}
        >
          📋 All Recipes
        </button>
        <button
          className={getButtonClass("saved")}
          onClick={() => setActiveFilter("saved")}
        >
          ❤️ Saved
        </button>
        <button
          className={getButtonClass("ai")}
          onClick={() => setActiveFilter("ai")}
        >
          🤖 AI Generated
        </button>
        <button
          className={getButtonClass("Breakfast")}
          onClick={() => setActiveFilter("Breakfast")}
        >
          🍳 Breakfast
        </button>
        <button
          className={getButtonClass("Lunch")}
          onClick={() => setActiveFilter("Lunch")}
        >
          🥗 Lunch
        </button>
        <button
          className={getButtonClass("Dinner")}
          onClick={() => setActiveFilter("Dinner")}
        >
          🍽️ Dinner
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search recipes or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
};

export default Header;
