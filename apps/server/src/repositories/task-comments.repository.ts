import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import db from "../db/drizzle";
import { taskComments, users } from "../db/schema";

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
export class TaskCommentsRepository {
  async createTaskComment(data: typeof taskComments.$inferInsert) {
    const [comment] = await db.insert(taskComments).values(data).returning();

    return this.getTaskComment(comment.id);
  }

  async getTaskComment(commentId: number) {
    const [comment] = await db
      .select(taskWithAuthorColumns)
      .from(taskComments)
      .leftJoin(users, eq(taskComments.userId, users.id))
      .where(eq(taskComments.id, commentId))
      .limit(1);

    return comment;
  }

  async getTaskComments(taskId: number) {
    const comments = await db
      .select(taskWithAuthorColumns)
      .from(taskComments)
      .leftJoin(users, eq(taskComments.userId, users.id))
      .where(eq(taskComments.taskId, taskId));

    return comments;
  }
}
