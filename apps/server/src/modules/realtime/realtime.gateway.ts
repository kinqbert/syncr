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
import { DEMO_USER_EMAIL, runInDemoContext } from "../../common/demo";
import { verifyAccessToken } from "../../common/utils/jwt";
import { AuthRepository } from "../../repositories/auth.repository";
import { UsersRepository } from "../../repositories/users.repository";
import {
  type AppServer,
  type AppSocket,
  companyRoom,
  getSocketUser,
  isCompanyRoom,
  isDemoUserRoom,
  setSocketUser,
  SOCKET_GATEWAY_OPTIONS,
  type SocketUser,
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
        .then((user) => {
          if (!user) {
            next(new Error("Unauthorized"));
            return;
          }

          setSocketUser(client, user);
          next();
        })
        .catch(() => next(new Error("Unauthorized")));
    });
  }

  async handleConnection(client: AppSocket) {
    const user = getSocketUser(client);

    if (user) {
      await client.join(userRoom(user.userId, user.isDemo));
    }
  }

  @SubscribeMessage("company.select")
  async handleCompanySelect(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: { companyId: number },
  ) {
    const user = getSocketUser(client);

    if (!user || !Number.isInteger(payload?.companyId)) {
      return;
    }

    const isMember = await runInDemoContext(user.isDemo, () =>
      this.usersRepository.isUserInCompany(user.userId, payload.companyId),
    );

    if (!isMember) {
      return;
    }

    for (const room of client.rooms) {
      if (isCompanyRoom(room)) {
        await client.leave(room);
      }
    }

    await client.join(companyRoom(payload.companyId, user.isDemo));
  }

  emitTaskChanged(companyId: number, payload: TaskChangedPayload) {
    this.server.to(companyRoom(companyId)).emit("task.changed", payload);
  }

  hasDemoViewers() {
    for (const room of this.server.sockets.adapter.rooms.keys()) {
      if (isDemoUserRoom(room)) {
        return true;
      }
    }

    return false;
  }

  private async authenticate(client: AppSocket): Promise<SocketUser | null> {
    if ((client.handshake.auth as { demo?: unknown }).demo === true) {
      const demoUser = await runInDemoContext(true, () =>
        this.authRepository.findUserByEmail(DEMO_USER_EMAIL),
      );

      return demoUser ? { userId: demoUser.id, isDemo: true } : null;
    }

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

    return { userId: payload.userId, isDemo: false };
  }
}
