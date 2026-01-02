import { UserPreferences } from "@/types/recipe-generator";

const NotificationSection = ({
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
        🔔 Notifications
      </h2>
      <p className="text-gray-600 mb-4">
        Choose what notifications you want to receive
      </p>

      <div className="space-y-3">
        {/* Expiry Alerts */}
        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={preferences.expiryAlerts}
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                expiryAlerts: e.target.checked,
              })
            }
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800">Expiry Alerts</div>
            <div className="text-sm text-gray-600">
              Get notified when items are about to expire
            </div>
          </div>
        </label>

        {/* Low Stock Alerts */}
        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={preferences.lowStockAlerts}
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                lowStockAlerts: e.target.checked,
              })
            }
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800">Low Stock Alerts</div>
            <div className="text-sm text-gray-600">
              Get notified when inventory is running low
            </div>
          </div>
        </label>

        {/* Shopping Reminders */}
        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={preferences.shoppingReminders}
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                shoppingReminders: e.target.checked,
              })
            }
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800">Shopping Reminders</div>
            <div className="text-sm text-gray-600">
              Remind me on my preferred shopping day
            </div>
          </div>
        </label>

        {/* Recipe Suggestions */}
        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={preferences.recipeSuggestions}
            disabled={disabled}
            onChange={(e) =>
              onUpdate({
                recipeSuggestions: e.target.checked,
              })
            }
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800">Recipe Suggestions</div>
            <div className="text-sm text-gray-600">
              Get personalized recipe recommendations
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default NotificationSection;
