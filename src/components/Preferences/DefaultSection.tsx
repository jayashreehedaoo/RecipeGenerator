import { SHOPPING_DAYS, UserPreferences } from "@/types/recipe-generator";

const DefaultSection = ({
  preferences,
  onUpdate,
  disabled = false,
}: {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => void;
  disabled?: boolean;
}) => {
  return (
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
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                servingsDefault: parseInt(e.target.value) || 4,
              })
            }
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
            onChange={(e) =>
              onUpdate({
                shoppingDay: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SHOPPING_DAYS.map((day: string) => (
              <option key={day} value={day}>
                {day}
              </option>
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
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                lowStockThreshold: parseFloat(e.target.value),
              })
            }
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">
            Alert when stock falls below{" "}
            {(preferences.lowStockThreshold * 100).toFixed(0)}%
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
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                expiryWarningDays: parseInt(e.target.value) || 3,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default DefaultSection;
