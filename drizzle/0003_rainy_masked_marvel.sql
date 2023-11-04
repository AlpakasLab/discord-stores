CREATE TABLE `items` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`image` varchar(255),
	`category_id` varchar(255) NOT NULL,
	`store_id` varchar(255) NOT NULL,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
