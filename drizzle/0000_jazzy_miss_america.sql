CREATE TABLE `Recipe` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`prepTime` integer NOT NULL,
	`cookTime` integer NOT NULL,
	`servings` integer NOT NULL,
	`calories` integer NOT NULL,
	`category` text NOT NULL,
	`source` text NOT NULL,
	`isSaved` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
