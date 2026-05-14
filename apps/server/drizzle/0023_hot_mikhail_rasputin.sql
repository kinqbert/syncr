CREATE INDEX "calendar_task_events_task_idx" ON "calendar_task_events" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "conversation_participants_user_conversation_idx" ON "conversations_participants" USING btree ("user_id","conversation_id");--> statement-breakpoint
CREATE INDEX "conversations_company_last_message_idx" ON "conversations" USING btree ("company_id","last_message_id");--> statement-breakpoint
CREATE INDEX "invitations_company_status_email_idx" ON "invitations" USING btree ("company_id","status","invitee_email");--> statement-breakpoint
CREATE INDEX "invitations_user_status_idx" ON "invitations" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "invitations_email_status_idx" ON "invitations" USING btree ("invitee_email","status");--> statement-breakpoint
CREATE INDEX "messages_conversation_created_idx" ON "messages" USING btree ("conversation_id","created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id","id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_reply_to_idx" ON "messages" USING btree ("reply_to_message_id");--> statement-breakpoint
CREATE INDEX "notifications_recipient_created_idx" ON "notifications" USING btree ("recipient_id","created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_recipient_read_idx" ON "notifications" USING btree ("recipient_id","is_read");--> statement-breakpoint
CREATE INDEX "notifications_recipient_type_entity_idx" ON "notifications" USING btree ("recipient_id","type","entity_id");--> statement-breakpoint
CREATE INDEX "project_users_project_user_idx" ON "project_users" USING btree ("project_id","user_id");--> statement-breakpoint
CREATE INDEX "project_users_user_project_idx" ON "project_users" USING btree ("user_id","project_id");--> statement-breakpoint
CREATE INDEX "projects_company_status_idx" ON "projects" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "projects_company_start_name_idx" ON "projects" USING btree ("company_id","start_date","name");--> statement-breakpoint
CREATE INDEX "task_acceptance_criteria_task_position_idx" ON "task_acceptance_criteria" USING btree ("task_id","position","id");--> statement-breakpoint
CREATE INDEX "task_activities_task_created_idx" ON "task_activities" USING btree ("task_id","created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "task_activities_created_idx" ON "task_activities" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "task_comments_task_created_idx" ON "task_comments" USING btree ("task_id","created_at");--> statement-breakpoint
CREATE INDEX "tasks_project_status_position_idx" ON "tasks" USING btree ("project_id","status","position","id");--> statement-breakpoint
CREATE INDEX "tasks_assignee_end_priority_idx" ON "tasks" USING btree ("assignee_id","end_date","priority","id");--> statement-breakpoint
CREATE INDEX "tasks_project_assignee_idx" ON "tasks" USING btree ("project_id","assignee_id");--> statement-breakpoint
CREATE INDEX "tasks_completed_at_idx" ON "tasks" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "user_company_roles_company_user_idx" ON "user_company_roles" USING btree ("company_id","user_id");