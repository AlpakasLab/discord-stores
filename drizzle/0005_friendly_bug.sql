CREATE TABLE `orders` (
	`id` varchar(255) NOT NULL,
	`employee_name` varchar(255) NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`discount` int,
	`total` int,
	`delivery` int,
	`comission` int,
	`store_value` int,
	`items` json,
	`created_at` timestamp(6) DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
