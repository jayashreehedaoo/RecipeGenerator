ALTER TABLE `UserPreferences` ALTER COLUMN "dietaryRestrictions" TO "dietaryRestrictions" text NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "allergies" TO "allergies" text NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "favoriteCuisines" TO "favoriteCuisines" text NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "dislikedIngredients" TO "dislikedIngredients" text NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "shoppingDay" TO "shoppingDay" text NOT NULL DEFAULT 'Saturday';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "lowStockThreshold" TO "lowStockThreshold" text NOT NULL DEFAULT '0.2';