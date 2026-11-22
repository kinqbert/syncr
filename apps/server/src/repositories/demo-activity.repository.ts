import { Injectable } from "@nestjs/common";
import { ProjectStatus } from "@syncr/packages";
import { and, eq, ne } from "drizzle-orm";

import { DEMO_USER_EMAIL } from "../common/demo";
import { DbProvider } from "../db/db.provider";
import {
  conversationParticipants,
  projects,
  projectUsers,
  tasks,
  userCompanyRoles,
  users,
} from "../db/schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class DemoActivityRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getDemoWorkspace() {
    const [workspace] = await this.db
      .select({ userId: users.id, companyId: userCompanyRoles.companyId })
      .from(users)
      .innerJoin(userCompanyRoles, eq(userCompanyRoles.userId, users.id))
      .where(eq(users.email, DEMO_USER_EMAIL))
      .limit(1);

    return workspace;
  }

  async getActiveProjectTasks(companyId: number) {
    return await this.db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        status: tasks.status,
        assigneeId: tasks.assigneeId,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(projects.companyId, companyId), eq(projects.status, ProjectStatus.Active)));
  }

  async getProjectMemberIds(projectId: number) {
    const members = await this.db
      .select({ userId: projectUsers.userId })
      .from(projectUsers)
      .where(eq(projectUsers.projectId, projectId));

    return members.map((member) => member.userId);
  }

  async getConversationPartners(userId: number) {
    const userConversations = this.db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId))
      .as("user_conversations");

    return await this.db
      .select({
        conversationId: conversationParticipants.conversationId,
        userId: conversationParticipants.userId,
      })
      .from(conversationParticipants)
      .innerJoin(
        userConversations,
        eq(userConversations.conversationId, conversationParticipants.conversationId),
      )
      .where(ne(conversationParticipants.userId, userId));
  }
}
