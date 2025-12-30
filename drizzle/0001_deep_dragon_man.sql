CREATE TABLE `InventoryItem` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit` text NOT NULL,
	`category` text NOT NULL,
	`expiryDate` integer DEFAULT (unixepoch()) NOT NULL,
	`addedDate` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ShoppingList` (
	`id` text PRIMARY KEY NOT NULL,
	`scheduledFor` integer DEFAULT (unixepoch()) NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`totalEstimatedCost` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ShoppingListItem` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit` text NOT NULL,
	`category` text NOT NULL,
	`purchased` integer DEFAULT false NOT NULL,
	`estimatedPrice` integer DEFAULT 0 NOT NULL
);
