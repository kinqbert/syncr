import { Injectable } from "@nestjs/common";
import { and, asc, eq, inArray } from "drizzle-orm";

import db from "../db/drizzle";
import { projectLabels, projects, taskLabels } from "../db/schema";

export const DEFAULT_PROJECT_LABELS = ["bug", "feature", "misc"] as const;

@Injectable()
export class LabelsRepository {
  async getProjectLabels(projectId: number, companyId: number) {
    return await db
      .select({
        id: projectLabels.id,
        projectId: projectLabels.projectId,
        name: projectLabels.name,
      })
      .from(projectLabels)
      .innerJoin(projects, eq(projectLabels.projectId, projects.id))
      .where(and(eq(projectLabels.projectId, projectId), eq(projects.companyId, companyId)))
      .orderBy(asc(projectLabels.name));
  }

  async getLabelsByTaskIds(taskIds: number[]) {
    if (taskIds.length === 0) {
      return [];
    }

    return await db
      .select({
        taskId: taskLabels.taskId,
        id: projectLabels.id,
        projectId: projectLabels.projectId,
        name: projectLabels.name,
      })
      .from(taskLabels)
      .innerJoin(projectLabels, eq(taskLabels.labelId, projectLabels.id))
      .where(inArray(taskLabels.taskId, taskIds))
      .orderBy(asc(projectLabels.name));
  }

  async createDefaultProjectLabels(projectId: number) {
    return await this.ensureProjectLabels(projectId, [...DEFAULT_PROJECT_LABELS]);
  }

  async ensureProjectLabels(projectId: number, labelNames: string[]) {
    const names = [...new Set(labelNames)];

    if (names.length === 0) {
      return [];
    }

    await db
      .insert(projectLabels)
      .values(names.map((name) => ({ projectId, name })))
      .onConflictDoNothing();

    return await db
      .select()
      .from(projectLabels)
      .where(and(eq(projectLabels.projectId, projectId), inArray(projectLabels.name, names)))
      .orderBy(asc(projectLabels.name));
  }

  async setTaskLabels(taskId: number, projectId: number, labelNames: string[]) {
    const labels = await this.ensureProjectLabels(projectId, labelNames);

    await db.transaction(async (tx) => {
      await tx.delete(taskLabels).where(eq(taskLabels.taskId, taskId));

      if (labels.length > 0) {
        await tx
          .insert(taskLabels)
          .values(labels.map((label) => ({ taskId, labelId: label.id })))
          .onConflictDoNothing();
      }
    });

    return labels;
  }
}
