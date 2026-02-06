ALTER TABLE "chrips" ALTER COLUMN "body" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashed_password" text DEFAULT 'unset' NOT NULL;