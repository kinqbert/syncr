CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weekly_load_minutes" integer DEFAULT 2400 NOT NULL;
