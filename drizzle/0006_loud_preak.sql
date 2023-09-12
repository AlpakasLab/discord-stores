ALTER TABLE `orders` MODIFY COLUMN `total` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `comission` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `store_value` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `items` json NOT NULL;