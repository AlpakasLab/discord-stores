ALTER TABLE `product_categories` ADD `store_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `store_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `store_id` varchar(255) NOT NULL;