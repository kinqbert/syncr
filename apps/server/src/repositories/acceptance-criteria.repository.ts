import { Injectable } from "@nestjs/common";
import { and, asc, count, eq, inArray } from "drizzle-orm";

import db from "../db/drizzle";
import { projects, taskAcceptanceCriteria, tasks } from "../db/schema";

const taskAcceptanceCriterionColumns = {
  id: taskAcceptanceCriteria.id,
  taskId: taskAcceptanceCriteria.taskId,
  description: taskAcceptanceCriteria.description,
  isDone: taskAcceptanceCriteria.isDone,
  position: taskAcceptanceCriteria.position,
};

@Injectable()
export class AcceptanceCriteriaRepository {
  async getByTaskIds(taskIds: number[]) {
    if (taskIds.length === 0) {
      return [];
    }

    return await db
      .select(taskAcceptanceCriterionColumns)
      .from(taskAcceptanceCriteria)
      .where(inArray(taskAcceptanceCriteria.taskId, taskIds))
      .orderBy(
        asc(taskAcceptanceCriteria.taskId),
        asc(taskAcceptanceCriteria.position),
        asc(taskAcceptanceCriteria.id),
      );
  }

  async getNextPosition(taskId: number) {
    const [result] = await db
      .select({ criteriaCount: count() })
      .from(taskAcceptanceCriteria)
      .where(eq(taskAcceptanceCriteria.taskId, taskId));

    return result.criteriaCount;
  }

  async createAcceptanceCriterion(data: typeof taskAcceptanceCriteria.$inferInsert) {
    const [criterion] = await db.insert(taskAcceptanceCriteria).values(data).returning();

    return criterion;
  }

  async updateAcceptanceCriterion(
    criterionId: number,
    data: Partial<typeof taskAcceptanceCriteria.$inferInsert>,
  ) {
    const [criterion] = await db
      .update(taskAcceptanceCriteria)
      .set(data)
      .where(eq(taskAcceptanceCriteria.id, criterionId))
      .returning();

    return criterion;
  }

  async deleteAcceptanceCriterion(criterionId: number) {
    const [criterion] = await db
      .delete(taskAcceptanceCriteria)
      .where(eq(taskAcceptanceCriteria.id, criterionId))
      .returning({ id: taskAcceptanceCriteria.id });

    return criterion;
  }

  async getAcceptanceCriterion(
    criterionId: number,
    taskId: number,
    projectId: number,
    companyId: number,
  ) {
    const [criterion] = await db
      .select({ id: taskAcceptanceCriteria.id })
      .from(taskAcceptanceCriteria)
      .innerJoin(tasks, eq(taskAcceptanceCriteria.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(taskAcceptanceCriteria.id, criterionId),
          eq(taskAcceptanceCriteria.taskId, taskId),
          eq(tasks.projectId, projectId),
          eq(projects.companyId, companyId),
        ),
      )
      .limit(1);

    return criterion;
  }
}
