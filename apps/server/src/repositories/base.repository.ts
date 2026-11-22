import { eq, inArray } from "drizzle-orm";

import type { ProjectViewer } from "../common/decorators/project-viewer.decorator";
import { DbProvider } from "../db/db.provider";
import { projects, projectUsers } from "../db/schema";

export abstract class BaseRepository {
  protected constructor(protected readonly dbProvider: DbProvider) {}

  protected get db() {
    return this.dbProvider.db;
  }

  protected visibleProjectsFilter(viewer: ProjectViewer) {
    if (viewer.canViewAllProjects) {
      return undefined;
    }

    return inArray(
      projects.id,
      this.db
        .select({ projectId: projectUsers.projectId })
        .from(projectUsers)
        .where(eq(projectUsers.userId, viewer.userId)),
    );
  }
}
