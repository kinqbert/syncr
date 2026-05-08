import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { UsersRepository } from "../../repositories/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService, UsersRepository, AuthRepository, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
