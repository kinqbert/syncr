import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { taskComments, users } from "../db/schema";
import { BaseRepository } from "./base.repository";

const taskWithAuthorColumns = {
  id: taskComments.id,
  taskId: taskComments.taskId,
  userId: taskComments.userId,
  content: taskComments.content,
  createdAt: taskComments.createdAt,
  user: {
    id: users.id,
    email: users.email,
    name: users.name,
    surname: users.surname,
  },
};

@Injectable()
export class TaskCommentsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async createTaskComment(data: typeof taskComments.$inferInsert) {
    const [comment] = await this.db.insert(taskComments).values(data).returning();

    return this.getTaskComment(comment.id);
  }

  async getTaskComment(commentId: number) {
    const [comment] = await this.db
      .select(taskWithAuthorColumns)
      .from(taskComments)
      .leftJoin(users, eq(taskComments.userId, users.id))
      .where(eq(taskComments.id, commentId))
      .limit(1);

    return comment;
  }

  async getTaskComments(taskId: number) {
    const comments = await this.db
      .select(taskWithAuthorColumns)
      .from(taskComments)
      .leftJoin(users, eq(taskComments.userId, users.id))
      .where(eq(taskComments.taskId, taskId))
      .orderBy(taskComments.createdAt);

    return comments;
  }
}
