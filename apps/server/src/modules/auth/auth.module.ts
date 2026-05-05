import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { UserRepository } from "../../repositories/user.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService, UserRepository, AuthRepository, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
