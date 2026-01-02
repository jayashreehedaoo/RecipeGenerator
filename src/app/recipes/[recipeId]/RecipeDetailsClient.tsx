'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleSaveRecipe } from '../actions';
import { addRecipeToShoppingList } from '@/app/shoppinglist/actions';
import { Recipe } from '@/types/recipe-generator';

interface Props {
  recipe: Recipe;
}

export function RecipeDetailsClient({ recipe: initialRecipe }: Props) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [isPending, startTransition] = useTransition();
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const router = useRouter();

  const handleToggleSave = () => {
    startTransition(async () => {
      const updatedRecipe = await toggleSaveRecipe(recipe.id);
      setRecipe({ ...recipe, isSaved: updatedRecipe.isSaved });
    });
  };

  const handleAddToShoppingList = async () => {
    setIsAddingToList(true);
    try {
      const result = await addRecipeToShoppingList(
        recipe.id,
        recipe.name,
        recipe.ingredients
      );
      
      if (result.success) {
        setNotification({
          show: true,
          message: result.message || 'Ingredients added to shopping list!',
          type: 'success'
        });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
      } else {
        setNotification({
          show: true,
          message: result.error || 'Failed to add ingredients',
          type: 'error'
        });
        setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 5000);
      }
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
      setNotification({
        show: true,
        message: 'Failed to add ingredients to shopping list. Please try again.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 5000);
    } finally {
      setIsAddingToList(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">
              {notification.type === 'success' ? '✓' : '✗'}
            </span>
            <div className="flex-1">
              <p className="font-medium">{notification.message}</p>
              {notification.type === 'success' && (
                <button
                  onClick={() => router.push('/shoppinglist')}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  View Shopping List →
                </button>
              )}
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="hover:bg-white/20 rounded-full p-1 transition-colors shrink-0"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link
        href="/recipes"
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <span className="mr-2">←</span> Back to Recipes
      </Link>

      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Hero Image */}
        <div className="h-64 bg-linear-to-br from-orange-300 to-pink-300 flex items-center justify-center">
          <span className="text-9xl">🍽️</span>
        </div>

        {/* Title and Meta */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
            <button
              onClick={handleToggleSave}
              disabled={isPending}
              className="text-4xl hover:scale-110 transition-transform disabled:opacity-50"
              title={recipe.isSaved ? 'Remove from saved' : 'Save recipe'}
            >
              {recipe.isSaved ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              📄 {recipe.source}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              🍴 {recipe.category}
            </span>
            {recipe.isSaved && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                ❤️ Saved
              </span>
            )}
            {recipe.source === 'AI Generated' && (
              <span className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                ✨ AI Generated
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg text-gray-800">
                {recipe.calories}
              </div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="font-bold text-lg text-gray-800">
                {recipe.servings}
              </div>
              <div className="text-xs text-gray-600">Servings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="font-bold text-lg text-gray-800">
                {recipe.prepTime} min
              </div>
              <div className="text-xs text-gray-600">Prep Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg text-gray-800">
                {recipe.cookTime} min
              </div>
              <div className="text-xs text-gray-600">Cook Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
            <span className="mr-2">📝</span> Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-3 mt-1 shrink-0">
                  ✓
                </span>
                <span className="flex-1 text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
            <span className="mr-2">👨‍🍳</span> Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  {idx + 1}
                </span>
                <span className="flex-1 pt-1 text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleAddToShoppingList}
          disabled={isAddingToList}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAddingToList ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <span>🛒</span>
              <span>Add to Shopping List</span>
            </>
          )}
        </button>
        <button
          onClick={() => router.push('/recipes?action=generate')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>✨</span>
          Generate Similar
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>🖨️</span>
          Print Recipe
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}