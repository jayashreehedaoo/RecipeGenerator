import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Pantry Chef!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered kitchen companion for managing inventory, discovering recipes, 
            and planning meals with ease.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {/* Inventory Management */}
          <Link href="/inventory" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-5xl sm:text-6xl mb-4">📦</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Inventory
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Track your ingredients, monitor expiry dates, and never waste food again.
              </p>
            </div>
          </Link>

          {/* Recipes */}
          <Link href="/recipes" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-5xl sm:text-6xl mb-4">🍽️</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Recipes
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Browse, create, and save your favorite recipes. AI-powered suggestions included!
              </p>
            </div>
          </Link>

          {/* Shopping List */}
          <Link href="/shoppinglist" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-5xl sm:text-6xl mb-4">🛒</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Shopping List
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Organize your grocery shopping with smart lists and recipe-based planning.
              </p>
            </div>
          </Link>
        </div>

        {/* AI Features Highlight */}
        <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-xl shadow-2xl p-6 sm:p-8 text-white text-center">
          <div className="text-4xl sm:text-5xl mb-4">✨</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            AI-Powered Recipe Generation
          </h2>
          <p className="text-sm sm:text-base mb-6 max-w-2xl mx-auto">
            Generate personalized recipes based on your available ingredients, 
            dietary preferences, and favorite cuisines. Extract recipes from URLs too!
          </p>
          <Link 
            href="/recipes"
            className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Try AI Recipe Generator
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">
              Smart
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Inventory Tracking</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
              AI
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Recipe Generation</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">
              Easy
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Shopping Lists</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1">
              Custom
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Preferences</div>
          </div>
        </div>
      </div>
    </div>
  );
}
