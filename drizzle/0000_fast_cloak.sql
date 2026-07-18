CREATE TABLE `post_views` (
	`slug` text PRIMARY KEY NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
