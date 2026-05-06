CREATE TYPE "public"."invitation_status" AS ENUM('cancelled', 'accepted', 'expired', 'active');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "invitation_status" DEFAULT 'active',
	"company_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"invitee_email" text NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_id_users_id_fk";
EXCEPTION
	WHEN undefined_object THEN NULL;
END $$;
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "assignee_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'tasks_assignee_id_users_id_fk'
	) THEN
		ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
	END IF;
END $$;
