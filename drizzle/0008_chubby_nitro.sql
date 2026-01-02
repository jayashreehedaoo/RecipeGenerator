ALTER TABLE `UserPreferences` ALTER COLUMN "userId" TO "userId" text NOT NULL DEFAULT 'default-user';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "dietaryRestrictions" TO "dietaryRestrictions" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "allergies" TO "allergies" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "favoriteCuisines" TO "favoriteCuisines" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `UserPreferences` ALTER COLUMN "dislikedIngredients" TO "dislikedIngredients" text NOT NULL DEFAULT '';