CREATE TABLE `optimistic_locks` (
	`id` text PRIMARY KEY NOT NULL,
	`expected` integer NOT NULL,
	`actual` integer NOT NULL,
	CONSTRAINT "valid_version" CHECK("optimistic_locks"."expected" = "optimistic_locks"."actual")
);
--> statement-breakpoint
CREATE TABLE `working_drafts` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`actor` text NOT NULL,
	`updated_at` text NOT NULL
);
