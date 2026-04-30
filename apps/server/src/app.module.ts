import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CompanyModule } from "./modules/company/company.module";
import { ProjectModule } from "./modules/project/project.module";

@Module({
  imports: [AuthModule, CompanyModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
