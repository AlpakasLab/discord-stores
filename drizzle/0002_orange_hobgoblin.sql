CREATE TABLE `discord_webhooks` (
	`id` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`category` varchar(6) NOT NULL,
	`store_id` varchar(255) NOT NULL,
	CONSTRAINT `discord_webhooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_roles` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`comission` int NOT NULL,
	`manager` boolean NOT NULL DEFAULT false,
	`store_id` varchar(255) NOT NULL,
	CONSTRAINT `employee_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` varchar(8) NOT NULL,
	`store_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`employee_role_id` varchar(255),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `active` boolean NOT NULL DEFAULT true;