import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { UserRepository } from "src/repositories/user.repository";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService, UserRepository, AuthRepository, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
