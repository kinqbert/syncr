CREATE TABLE IF NOT EXISTS "project_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "project_labels_projectId_name_unique" UNIQUE("project_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_labels" (
	"task_id" integer NOT NULL,
	"label_id" integer NOT NULL,
	CONSTRAINT "task_labels_taskId_labelId_unique" UNIQUE("task_id","label_id")
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'project_labels_project_id_projects_id_fk'
	) THEN
		ALTER TABLE "project_labels" ADD CONSTRAINT "project_labels_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'task_labels_task_id_tasks_id_fk'
	) THEN
		ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'task_labels_label_id_project_labels_id_fk'
	) THEN
		ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_label_id_project_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."project_labels"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
INSERT INTO "project_labels" ("project_id", "name")
SELECT "projects"."id", "default_labels"."name"
FROM "projects"
CROSS JOIN (VALUES ('bug'), ('feature'), ('misc')) AS "default_labels"("name")
ON CONFLICT DO NOTHING;
