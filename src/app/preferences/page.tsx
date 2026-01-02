'use client';

import { useState, useEffect } from 'react';
import { 
  UserPreferences, 
  DIETARY_OPTIONS, 
  CUISINE_OPTIONS, 
  SHOPPING_DAYS 
} from '@/types/preferences';
import { Save, X } from 'lucide-react';
import { getUserPreferences, saveUserPreferences } from './actions';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    favoriteCuisines: [],
    dislikedIngredients: [],
    servingsDefault: 4,
    shoppingDay: 'Sunday',
    lowStockThreshold: 0.2,
    expiryWarningDays: 3,
    expiryAlerts: true,
    lowStockAlerts: true,
    shoppingReminders: true,
    recipeSuggestions: true,
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        setPreferences(prefs as UserPreferences);
      } catch (error) {
        console.error('Failed to load preferences:', error);
        setSaveMessage('Failed to load preferences.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Toggle dietary restriction
  const toggleDietary = (option: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(option)
        ? prev.dietaryRestrictions.filter((d: string) => d !== option)
        : [...prev.dietaryRestrictions, option]
    }));
  };

  // Toggle cuisine preference
  const toggleCuisine = (option: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      favoriteCuisines: prev.favoriteCuisines.includes(option)
        ? prev.favoriteCuisines.filter((c: string) => c !== option)
        : [...prev.favoriteCuisines, option]
    }));
  };

  // Add allergy
  const addAllergy = () => {
    if (allergyInput.trim() && !preferences.allergies.includes(allergyInput.trim())) {
      setPreferences((prev: UserPreferences) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput('');
    }
  };

  // Remove allergy
  const removeAllergy = (allergy: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      allergies: prev.allergies.filter((a: string) => a !== allergy)
    }));
  };

  // Add disliked ingredient
  const addDisliked = () => {
    if (dislikedInput.trim() && !preferences.dislikedIngredients.includes(dislikedInput.trim())) {
      setPreferences((prev: UserPreferences) => ({
        ...prev,
        dislikedIngredients: [...prev.dislikedIngredients, dislikedInput.trim()]
      }));
      setDislikedInput('');
    }
  };

  // Remove disliked ingredient
  const removeDisliked = (ingredient: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      dislikedIngredients: prev.dislikedIngredients.filter((i: string) => i !== ingredient)
    }));
  };

  // Save preferences
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await saveUserPreferences({
        dietaryRestrictions: preferences.dietaryRestrictions,
        allergies: preferences.allergies,
        favoriteCuisines: preferences.favoriteCuisines,
        dislikedIngredients: preferences.dislikedIngredients,
        servingsDefault: preferences.servingsDefault,
        shoppingDay: preferences.shoppingDay,
        lowStockThreshold: preferences.lowStockThreshold,
        expiryWarningDays: preferences.expiryWarningDays,
        expiryAlerts: preferences.expiryAlerts,
        lowStockAlerts: preferences.lowStockAlerts,
        shoppingReminders: preferences.shoppingReminders,
        recipeSuggestions: preferences.recipeSuggestions,
      });
      
      setSaveMessage('Preferences saved successfully! ✓');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Preferences</h1>
          <p className="text-gray-600">Customize your recipe and cooking experience</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading your preferences...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <>
            {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('successfully') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Dietary Restrictions Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🥗 Dietary Restrictions
            </h2>
            <p className="text-gray-600 mb-4">Select your dietary preferences</p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option: string) => (
                <button
                  key={option}
                  onClick={() => toggleDietary(option)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    preferences.dietaryRestrictions.includes(option)
                      ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🚫 Allergies
            </h2>
            <p className="text-gray-600 mb-4">List ingredients you&apos;re allergic to</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                placeholder="e.g., peanuts, shellfish"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addAllergy}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {preferences.allergies.map((allergy: string) => (
                <div
                  key={allergy}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full"
                >
                  <span className="font-medium">{allergy}</span>
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="hover:bg-red-200 rounded-full p-1 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {preferences.allergies.length === 0 && (
                <p className="text-gray-400 italic">No allergies added</p>
              )}
            </div>
          </div>

          {/* Favorite Cuisines Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🌍 Favorite Cuisines
            </h2>
            <p className="text-gray-600 mb-4">Choose cuisines you enjoy</p>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((option: string) => (
                <button
                  key={option}
                  onClick={() => toggleCuisine(option)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    preferences.favoriteCuisines.includes(option)
                      ? 'bg-purple-500 text-white shadow-md hover:bg-purple-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Disliked Ingredients Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              👎 Disliked Ingredients
            </h2>
            <p className="text-gray-600 mb-4">Ingredients you prefer to avoid</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={dislikedInput}
                onChange={(e) => setDislikedInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDisliked()}
                placeholder="e.g., cilantro, mushrooms"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addDisliked}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {preferences.dislikedIngredients.map((ingredient: string) => (
                <div
                  key={ingredient}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full"
                >
                  <span className="font-medium">{ingredient}</span>
                  <button
                    onClick={() => removeDisliked(ingredient)}
                    className="hover:bg-orange-200 rounded-full p-1 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {preferences.dislikedIngredients.length === 0 && (
                <p className="text-gray-400 italic">No disliked ingredients added</p>
              )}
            </div>
          </div>

          {/* Default Settings Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔧 Default Settings
            </h2>
            
            <div className="space-y-4">
              {/* Default Servings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Number of Servings
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={preferences.servingsDefault}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    servingsDefault: parseInt(e.target.value) || 4
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Shopping Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Shopping Day
                </label>
                <select
                  value={preferences.shoppingDay}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    shoppingDay: e.target.value
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SHOPPING_DAYS.map((day: string) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Alert Threshold (20%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={preferences.lowStockThreshold}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    lowStockThreshold: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  Alert when stock falls below {(preferences.lowStockThreshold * 100).toFixed(0)}%
                </div>
              </div>

              {/* Expiry Warning Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Warning (days before expiration)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={preferences.expiryWarningDays}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    expiryWarningDays: parseInt(e.target.value) || 3
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔔 Notifications
            </h2>
            <p className="text-gray-600 mb-4">Choose what notifications you want to receive</p>
            
            <div className="space-y-3">
              {/* Expiry Alerts */}
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.expiryAlerts}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    expiryAlerts: e.target.checked
                  }))}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Expiry Alerts</div>
                  <div className="text-sm text-gray-600">Get notified when items are about to expire</div>
                </div>
              </label>

              {/* Low Stock Alerts */}
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.lowStockAlerts}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    lowStockAlerts: e.target.checked
                  }))}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Low Stock Alerts</div>
                  <div className="text-sm text-gray-600">Get notified when inventory is running low</div>
                </div>
              </label>

              {/* Shopping Reminders */}
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.shoppingReminders}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    shoppingReminders: e.target.checked
                  }))}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Shopping Reminders</div>
                  <div className="text-sm text-gray-600">Remind me on my preferred shopping day</div>
                </div>
              </label>

              {/* Recipe Suggestions */}
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.recipeSuggestions}
                  onChange={(e) => setPreferences((prev: UserPreferences) => ({
                    ...prev,
                    recipeSuggestions: e.target.checked
                  }))}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Recipe Suggestions</div>
                  <div className="text-sm text-gray-600">Get personalized recipe recommendations</div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={24} />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}