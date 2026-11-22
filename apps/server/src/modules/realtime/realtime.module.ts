import { Module } from "@nestjs/common";

import { AuthRepository } from "../../repositories/auth.repository";
import { UsersRepository } from "../../repositories/users.repository";
import { RealtimeGateway } from "./realtime.gateway";

@Module({
  providers: [RealtimeGateway, AuthRepository, UsersRepository],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
