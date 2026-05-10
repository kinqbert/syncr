import { Injectable, Logger } from "@nestjs/common";

import { CONFIG } from "../../config/configuration";
import { CalendarConnectionsRepository } from "../../repositories/calendar-connections.repository";
import { CalendarConnection, CalendarEventInput, CalendarTask } from "./calendar.types";
import { CalendarProviderRegistry } from "./calendar-provider.registry";
import { TokenCryptoService } from "./token-crypto.service";

@Injectable()
export class CalendarSyncService {
  private readonly logger = new Logger(CalendarSyncService.name);

  constructor(
    private readonly calendarConnectionsRepository: CalendarConnectionsRepository,
    private readonly calendarProviderRegistry: CalendarProviderRegistry,
    private readonly tokenCryptoService: TokenCryptoService,
  ) {}

  async syncTaskDeadline(task: CalendarTask) {
    if (!task.assignee?.id || !task.endDate) {
      await this.deleteTaskEvents(task.id);

      return;
    }

    const connections = await this.calendarConnectionsRepository.getConnectionsForTaskAssignee(
      task.assignee.id,
    );

    await Promise.all(
      connections.map(async (connection) => {
        try {
          await this.syncConnectionTaskDeadline(connection, task);
        } catch (error) {
          this.logger.error(
            `Failed to sync task ${task.id} to ${connection.provider} calendar`,
            error instanceof Error ? error.stack : undefined,
          );
        }
      }),
    );
  }

  async deleteTaskEvents(taskId: number) {
    const links = await this.calendarConnectionsRepository.getTaskEventLinks(taskId);

    await Promise.all(
      links.map(async ({ connection, link }) => {
        try {
          const accessToken = await this.getAccessToken(connection);

          await this.calendarProviderRegistry
            .getClient(connection.provider)
            .deleteEvent(accessToken, connection.calendarId, link.providerEventId);
        } catch (error) {
          this.logger.error(
            `Failed to delete calendar event for task ${taskId}`,
            error instanceof Error ? error.stack : undefined,
          );
        } finally {
          await this.calendarConnectionsRepository.deleteTaskEventLink(connection.id, taskId);
        }
      }),
    );
  }

  async deleteConnectionEvents(connection: CalendarConnection) {
    const links = await this.calendarConnectionsRepository.getTaskEventLinksForConnection(
      connection.id,
    );
    const accessToken = await this.getAccessToken(connection);
    const client = this.calendarProviderRegistry.getClient(connection.provider);

    await Promise.all(
      links.map(async (link) => {
        await client.deleteEvent(accessToken, connection.calendarId, link.providerEventId);

        await this.calendarConnectionsRepository.deleteTaskEventLink(connection.id, link.taskId);
      }),
    );
  }

  private async syncConnectionTaskDeadline(connection: CalendarConnection, task: CalendarTask) {
    const accessToken = await this.getAccessToken(connection);
    const event = this.toCalendarEvent(task);
    const existingLink = await this.calendarConnectionsRepository.getTaskEventLink(
      connection.id,
      task.id,
    );
    const client = this.calendarProviderRegistry.getClient(connection.provider);

    if (existingLink) {
      await client.updateEvent(
        accessToken,
        connection.calendarId,
        existingLink.providerEventId,
        event,
      );

      await this.calendarConnectionsRepository.upsertTaskEventLink(
        connection.id,
        task.id,
        existingLink.providerEventId,
      );

      return;
    }

    const providerEventId = await client.createEvent(accessToken, connection.calendarId, event);

    await this.calendarConnectionsRepository.upsertTaskEventLink(
      connection.id,
      task.id,
      providerEventId,
    );
  }

  private async getAccessToken(connection: CalendarConnection) {
    const refreshBufferMs = 60 * 1000;

    if (connection.expiresAt.getTime() > Date.now() + refreshBufferMs) {
      return this.tokenCryptoService.decrypt(connection.accessToken);
    }

    const refreshToken = this.tokenCryptoService.decrypt(connection.refreshToken);
    const refreshedTokens = await this.calendarProviderRegistry
      .getClient(connection.provider)
      .refreshAccessToken(refreshToken);

    await this.calendarConnectionsRepository.updateConnectionTokens(connection.id, {
      accessToken: this.tokenCryptoService.encrypt(refreshedTokens.accessToken),
      refreshToken: refreshedTokens.refreshToken
        ? this.tokenCryptoService.encrypt(refreshedTokens.refreshToken)
        : connection.refreshToken,
      expiresAt: refreshedTokens.expiresAt,
    });

    return refreshedTokens.accessToken;
  }

  private toCalendarEvent(task: CalendarTask): CalendarEventInput {
    const startDate = this.toDateOnly(task.endDate!);
    const endDate = this.toDateOnly(this.addDays(task.endDate!, 1));

    return {
      taskId: task.id,
      title: this.getEventTitle(task),
      description: task.description || "Syncr task deadline",
      startDate,
      endDate,
      url: `${CONFIG.CLIENT_URL}/projects/${task.projectId}/tasks/${task.id}`,
    };
  }

  private getEventTitle(task: CalendarTask) {
    if (!task.project?.name) {
      return `Deadline: ${task.name}`;
    }

    return `Deadline: ${task.name} (${task.project.name})`;
  }

  private toDateOnly(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);

    return next;
  }
}
