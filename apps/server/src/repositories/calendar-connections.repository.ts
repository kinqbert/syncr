import { Injectable } from "@nestjs/common";
import { CalendarProvider } from "@syncr/packages";
import { and, eq } from "drizzle-orm";

import db from "../db/drizzle";
import { calendarConnections, calendarTaskEvents } from "../db/schema";

@Injectable()
export class CalendarConnectionsRepository {
  async getConnectionsByUserId(userId: number) {
    return await db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.userId, userId));
  }

  async getConnection(userId: number, provider: CalendarProvider) {
    const [connection] = await db
      .select()
      .from(calendarConnections)
      .where(
        and(eq(calendarConnections.userId, userId), eq(calendarConnections.provider, provider)),
      )
      .limit(1);

    return connection;
  }

  async getConnectionsForTaskAssignee(userId: number) {
    return await this.getConnectionsByUserId(userId);
  }

  async upsertConnection(data: typeof calendarConnections.$inferInsert) {
    const [connection] = await db
      .insert(calendarConnections)
      .values(data)
      .onConflictDoUpdate({
        target: [calendarConnections.userId, calendarConnections.provider],
        set: {
          providerAccountEmail: data.providerAccountEmail,
          calendarId: data.calendarId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          updatedAt: new Date(),
        },
      })
      .returning();

    return connection;
  }

  async updateConnectionTokens(
    connectionId: number,
    data: Pick<typeof calendarConnections.$inferInsert, "accessToken" | "expiresAt"> &
      Partial<Pick<typeof calendarConnections.$inferInsert, "refreshToken">>,
  ) {
    const [connection] = await db
      .update(calendarConnections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(calendarConnections.id, connectionId))
      .returning();

    return connection;
  }

  async deleteConnection(userId: number, provider: CalendarProvider) {
    await db
      .delete(calendarConnections)
      .where(
        and(eq(calendarConnections.userId, userId), eq(calendarConnections.provider, provider)),
      );
  }

  async getTaskEventLink(connectionId: number, taskId: number) {
    const [link] = await db
      .select()
      .from(calendarTaskEvents)
      .where(
        and(
          eq(calendarTaskEvents.connectionId, connectionId),
          eq(calendarTaskEvents.taskId, taskId),
        ),
      )
      .limit(1);

    return link;
  }

  async upsertTaskEventLink(connectionId: number, taskId: number, providerEventId: string) {
    const [link] = await db
      .insert(calendarTaskEvents)
      .values({ connectionId, taskId, providerEventId, lastSyncedAt: new Date() })
      .onConflictDoUpdate({
        target: [calendarTaskEvents.connectionId, calendarTaskEvents.taskId],
        set: { providerEventId, lastSyncedAt: new Date() },
      })
      .returning();

    return link;
  }

  async deleteTaskEventLink(connectionId: number, taskId: number) {
    await db
      .delete(calendarTaskEvents)
      .where(
        and(
          eq(calendarTaskEvents.connectionId, connectionId),
          eq(calendarTaskEvents.taskId, taskId),
        ),
      );
  }

  async getTaskEventLinks(taskId: number) {
    return await db
      .select({
        link: calendarTaskEvents,
        connection: calendarConnections,
      })
      .from(calendarTaskEvents)
      .innerJoin(calendarConnections, eq(calendarTaskEvents.connectionId, calendarConnections.id))
      .where(eq(calendarTaskEvents.taskId, taskId));
  }
}
