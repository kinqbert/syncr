ALTER TYPE "public"."task_activity_action" ADD VALUE 'task_estimate_updated' BEFORE 'task_labels_updated';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "estimate_minutes" integer;