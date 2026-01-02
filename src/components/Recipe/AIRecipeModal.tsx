'use client';

import { useState } from 'react';
import { X, Sparkles, Link as LinkIcon, Loader2 } from 'lucide-react';
import {
  generateRecipeFromInventoryAction,
  extractRecipeFromUrlAction,
} from '@/app/recipes/ai-actions';

interface AIRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Mode = 'inventory' | 'url';

export function AIRecipeModal({
  isOpen,
  onClose,
  onSuccess,
}: AIRecipeModalProps) {
  const [mode, setMode] = useState<Mode>('inventory');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for inventory-based generation
  const [preferences, setPreferences] = useState({
    cuisine: '',
    difficulty: '',
    dietary: '',
    maxPrepTime: '',
  });

  // State for URL extraction
  const [url, setUrl] = useState('');
  const [contentText, setContentText] = useState('');

  const handleGenerateFromInventory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateRecipeFromInventoryAction({
        cuisine: preferences.cuisine || undefined,
        difficulty: preferences.difficulty || undefined,
        dietary: preferences.dietary || undefined,
        maxPrepTime: preferences.maxPrepTime
          ? parseInt(preferences.maxPrepTime)
          : undefined,
      });

      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setPreferences({
          cuisine: '',
          difficulty: '',
          dietary: '',
          maxPrepTime: '',
        });
      } else {
        setError(result.error || 'Failed to generate recipe');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractFromUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await extractRecipeFromUrlAction(
        url,
        contentText || undefined
      );

      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setUrl('');
        setContentText('');
      } else {
        setError(result.error || 'Failed to extract recipe');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'inventory') {
      handleGenerateFromInventory();
    } else {
      handleExtractFromUrl();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-purple-500" size={28} />
            AI Recipe Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Selection Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('inventory')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'inventory'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isLoading}
          >
            <Sparkles size={20} />
            From Inventory
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'url'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isLoading}
          >
            <LinkIcon size={20} />
            From URL
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'inventory' ? (
            <>
              {/* Inventory Mode */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-800">
                  <Sparkles className="inline mr-1" size={16} />
                  AI will generate a recipe using ingredients from your
                  inventory. Customize with preferences below (all optional).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cuisine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    value={preferences.cuisine}
                    onChange={(e) =>
                      setPreferences({ ...preferences, cuisine: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Italian, Mexican, Asian"
                    disabled={isLoading}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={preferences.difficulty}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Any</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Dietary Restriction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restriction
                  </label>
                  <input
                    type="text"
                    value={preferences.dietary}
                    onChange={(e) =>
                      setPreferences({ ...preferences, dietary: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                    disabled={isLoading}
                  />
                </div>

                {/* Max Prep Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={preferences.maxPrepTime}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        maxPrepTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 30"
                    min="1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* URL Mode */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <LinkIcon className="inline mr-1" size={16} />
                  Paste a URL from a blog post, YouTube video, or Instagram
                  reel. AI will extract the recipe for you.
                </p>
              </div>

              {/* Recipe URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe URL *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/recipe or youtube.com/watch?v=..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Optional Content Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Paste Recipe Text{' '}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="If you've copied the recipe text, paste it here for better accuracy..."
                  rows={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: If the URL doesn&apos;t work well, try copying the recipe
                  text and pasting it here instead.
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {mode === 'inventory'
                    ? 'Generate Recipe'
                    : 'Extract Recipe'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Info */}
        {isLoading && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⏳ This may take 10-30 seconds. AI is analyzing and generating your
            recipe...
          </div>
        )}
      </div>
    </div>
  );
}