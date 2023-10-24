CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`value` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`store_id` varchar(255) NOT NULL,
	`created_at` timestamp(3) DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
