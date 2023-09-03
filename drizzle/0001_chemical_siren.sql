CREATE TABLE `stores` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`serverId` varchar(255) NOT NULL,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`),
	CONSTRAINT `stores_serverId_unique` UNIQUE(`serverId`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` varchar(6) DEFAULT 'SELLER' NOT NULL;