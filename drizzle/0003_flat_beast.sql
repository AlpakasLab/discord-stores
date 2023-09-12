CREATE TABLE `webhooks_templates` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255),
	`color` int,
	`image` varchar(255),
	`json` json,
	CONSTRAINT `webhooks_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `discord_webhooks` ADD `webhook_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `discord_webhooks` ADD CONSTRAINT `discord_webhooks_webhook_id_unique` UNIQUE(`webhook_id`);