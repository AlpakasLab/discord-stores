ALTER TABLE `discord_webhooks` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `employee_roles` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `employees` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `orders` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `product_categories` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `products` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `products_to_tags` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `session` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `tags` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `verificationToken` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `webhooks_templates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `employee_roles` MODIFY COLUMN `manager` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_roles` MODIFY COLUMN `manager` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp(3) NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `product_categories` MODIFY COLUMN `order` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `active` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `emailVerified` timestamp(3) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `products` ADD `employee_comission` int;--> statement-breakpoint
ALTER TABLE `discord_webhooks` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `employee_roles` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `employees` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `orders` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `product_categories` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `products` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `products_to_tags` ADD PRIMARY KEY(`product_id`,`tag_id`);--> statement-breakpoint
ALTER TABLE `session` ADD PRIMARY KEY(`sessionToken`);--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `tags` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `user` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `verificationToken` ADD PRIMARY KEY(`identifier`,`token`);--> statement-breakpoint
ALTER TABLE `webhooks_templates` ADD PRIMARY KEY(`id`);