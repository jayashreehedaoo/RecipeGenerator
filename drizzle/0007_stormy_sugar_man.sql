CREATE TABLE `UserPreferences` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text DEFAULT 'default-user',
	`dietaryRestrictions` text DEFAULT '[]' NOT NULL,
	`allergies` text DEFAULT '[]' NOT NULL,
	`favoriteCuisines` text DEFAULT '[]' NOT NULL,
	`dislikedIngredients` text DEFAULT '[]' NOT NULL,
	`servingsDefault` integer DEFAULT 4 NOT NULL,
	`shoppingDay` text DEFAULT 'Sunday' NOT NULL,
	`lowStockThreshold` integer DEFAULT 20 NOT NULL,
	`expiryWarningDays` integer DEFAULT 3 NOT NULL,
	`expiryAlerts` integer DEFAULT true NOT NULL,
	`lowStockAlerts` integer DEFAULT true NOT NULL,
	`shoppingReminders` integer DEFAULT true NOT NULL,
	`recipeSuggestions` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
