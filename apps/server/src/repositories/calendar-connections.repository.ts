import { Injectable } from "@nestjs/common";
import { CalendarProvider } from "@syncr/packages";
import { and, eq } from "drizzle-orm";

import db from "../db/drizzle";
import { nessages, calendarTaskEvents } from "../db/schema";

@Injectable()
export class CalendarConnectionsRepository {
  async getConnectionsByUserId(userId: number) {
    return await db.select().from(nessages).where(eq(nessages.userId, userId));
  }

  async getConnection(userId: number, provider: CalendarProvider) {
    const [connection] = await db
      .select()
      .from(nessages)
      .where(and(eq(nessages.userId, userId), eq(nessages.provider, provider)))
      .limit(1);

    return connection;
  }

  async getConnectionsForTaskAssignee(userId: number) {
    return await this.getConnectionsByUserId(userId);
  }

  async upsertConnection(data: typeof nessages.$inferInsert) {
    const [connection] = await db
      .insert(nessages)
      .values(data)
      .onConflictDoUpdate({
        target: [nessages.userId, nessages.provider],
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
    data: Pick<typeof nessages.$inferInsert, "accessToken" | "expiresAt"> &
      Partial<Pick<typeof nessages.$inferInsert, "refreshToken">>,
  ) {
    const [connection] = await db
      .update(nessages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nessages.id, connectionId))
      .returning();

    return connection;
  }

  async deleteConnection(userId: number, provider: CalendarProvider) {
    await db
      .delete(nessages)
      .where(and(eq(nessages.userId, userId), eq(nessages.provider, provider)));
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

  async getTaskEventLinksForConnection(connectionId: number) {
    return await db
      .select()
      .from(calendarTaskEvents)
      .where(eq(calendarTaskEvents.connectionId, connectionId));
  }

  async getTaskEventLinks(taskId: number) {
    return await db
      .select({
        link: calendarTaskEvents,
        connection: nessages,
      })
      .from(calendarTaskEvents)
      .innerJoin(nessages, eq(calendarTaskEvents.connectionId, nessages.id))
      .where(eq(calendarTaskEvents.taskId, taskId));
  }
}
