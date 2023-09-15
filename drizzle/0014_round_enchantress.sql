ALTER TABLE `orders` MODIFY COLUMN `store_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `employee_id` varchar(255);