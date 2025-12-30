DROP TABLE `ShoppingList`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_InventoryItem` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit` text NOT NULL,
	`category` text NOT NULL,
	`expiryDate` integer NOT NULL,
	`addedDate` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_InventoryItem`("id", "name", "quantity", "unit", "category", "expiryDate", "addedDate") SELECT "id", "name", "quantity", "unit", "category", "expiryDate", "addedDate" FROM `InventoryItem`;--> statement-breakpoint
DROP TABLE `InventoryItem`;--> statement-breakpoint
ALTER TABLE `__new_InventoryItem` RENAME TO `InventoryItem`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `ShoppingListItem` DROP COLUMN `estimatedPrice`;