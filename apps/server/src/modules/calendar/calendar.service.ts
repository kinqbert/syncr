import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CalendarConnection, CalendarProvider } from "@syncr/packages";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

import { CONFIG } from "../../config/configuration";
import { CalendarConnectionsRepository } from "../../repositories/calendar-connections.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { CalendarProviderRegistry } from "./calendar-provider.registry";
import { CalendarSyncService } from "./calendar-sync.service";
import { TokenCryptoService } from "./token-crypto.service";

type CalendarOAuthState = {
  userId: number;
  provider: CalendarProvider;
  nonce: string;
};

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarConnectionsRepository: CalendarConnectionsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly calendarProviderRegistry: CalendarProviderRegistry,
    private readonly calendarSyncService: CalendarSyncService,
    private readonly tokenCryptoService: TokenCryptoService,
  ) {}

  async getConnections(userId: number): Promise<CalendarConnection[]> {
    const connections = await this.calendarConnectionsRepository.getConnectionsByUserId(userId);

    return connections.map((connection) => ({
      id: connection.id,
      provider: connection.provider,
      providerAccountEmail: connection.providerAccountEmail,
      calendarId: connection.calendarId,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString(),
    }));
  }

  getAuthorizationUrl(userId: number, provider: CalendarProvider) {
    return this.calendarProviderRegistry.getClient(provider).getAuthorizationUrl(
      this.signState({
        userId,
        provider,
        nonce: randomBytes(16).toString("base64url"),
      }),
    );
  }

  async completeOAuth(provider: CalendarProvider, code: string, state: string) {
    const parsedState = this.verifyState(state);

    if (parsedState.provider !== provider) {
      throw new UnauthorizedException("Calendar OAuth state provider mismatch");
    }

    const tokens = await this.calendarProviderRegistry.getClient(provider).exchangeCode(code);

    if (!tokens.refreshToken) {
      throw new BadRequestException("Calendar provider did not return a refresh token");
    }

    await this.calendarConnectionsRepository.upsertConnection({
      userId: parsedState.userId,
      provider,
      providerAccountEmail: tokens.accountEmail,
      calendarId: "primary",
      accessToken: this.tokenCryptoService.encrypt(tokens.accessToken),
      refreshToken: this.tokenCryptoService.encrypt(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    });

    await this.syncExistingDeadlines(parsedState.userId);
  }

  async disconnect(userId: number, provider: CalendarProvider) {
    await this.calendarConnectionsRepository.deleteConnection(userId, provider);
  }

  private signState(state: CalendarOAuthState) {
    const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
    const signature = this.getStateSignature(payload);

    return `${payload}.${signature}`;
  }

  private verifyState(value: string): CalendarOAuthState {
    const [payload, signature] = value.split(".");

    if (!payload || !signature) {
      throw new UnauthorizedException("Calendar OAuth state is invalid");
    }

    const expectedSignature = this.getStateSignature(payload);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException("Calendar OAuth state is invalid");
    }

    let state: CalendarOAuthState;

    try {
      state = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedException("Calendar OAuth state is invalid");
    }

    if (!this.isProvider(state.provider) || !Number.isInteger(state.userId)) {
      throw new UnauthorizedException("Calendar OAuth state is invalid");
    }

    return state;
  }

  private getStateSignature(payload: string) {
    return createHmac("sha256", CONFIG.REFRESH_TOKEN_SECRET).update(payload).digest("base64url");
  }

  private isProvider(value: string): value is CalendarProvider {
    return this.calendarProviderRegistry.isSupported(value);
  }

  private async syncExistingDeadlines(userId: number) {
    const tasks = await this.tasksRepository.getAssignedTasksWithDeadlines(userId);

    await Promise.all(tasks.map((task) => this.calendarSyncService.syncTaskDeadline(task)));
  }
}
