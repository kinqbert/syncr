import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { TaskChangedPayload } from "@syncr/packages";
import { parse as parseCookie } from "cookie";

import { COOKIE_PARAM } from "../../common/constants/cookie-param";
import { verifyAccessToken } from "../../common/utils/jwt";
import { AuthRepository } from "../../repositories/auth.repository";
import { UsersRepository } from "../../repositories/users.repository";
import {
  type AppServer,
  type AppSocket,
  companyRoom,
  getSocketUserId,
  isCompanyRoom,
  setSocketUserId,
  SOCKET_GATEWAY_OPTIONS,
  userRoom,
} from "./socket";

@WebSocketGateway(SOCKET_GATEWAY_OPTIONS)
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: AppServer;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // authenticating in middleware guarantees the user is known before any event handler runs
  afterInit(server: AppServer) {
    server.use((client, next) => {
      this.authenticate(client)
        .then((userId) => {
          if (userId === null) {
            next(new Error("Unauthorized"));
            return;
          }

          setSocketUserId(client, userId);
          next();
        })
        .catch(() => next(new Error("Unauthorized")));
    });
  }

  async handleConnection(client: AppSocket) {
    const userId = getSocketUserId(client);

    if (userId !== null) {
      await client.join(userRoom(userId));
    }
  }

  @SubscribeMessage("company.select")
  async handleCompanySelect(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: { companyId: number },
  ) {
    const userId = getSocketUserId(client);

    if (userId === null || !Number.isInteger(payload?.companyId)) {
      return;
    }

    if (!(await this.usersRepository.isUserInCompany(userId, payload.companyId))) {
      return;
    }

    for (const room of client.rooms) {
      if (isCompanyRoom(room)) {
        await client.leave(room);
      }
    }

    await client.join(companyRoom(payload.companyId));
  }

  emitTaskChanged(companyId: number, payload: TaskChangedPayload) {
    this.server.to(companyRoom(companyId)).emit("task.changed", payload);
  }

  private async authenticate(client: AppSocket) {
    const cookies = parseCookie(client.handshake.headers.cookie ?? "");
    const accessToken = cookies[COOKIE_PARAM.accessToken];
    const sessionId = cookies[COOKIE_PARAM.sessionId];

    if (!accessToken || !sessionId) {
      return null;
    }

    const payload = verifyAccessToken(accessToken);
    const session = await this.authRepository.findSessionById(sessionId);

    if (!session || session.userId !== payload.userId || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return payload.userId;
  }
}
