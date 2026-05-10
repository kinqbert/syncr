import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { InvitationsModule } from "./modules/invitations/invitations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TeamModule } from "./modules/team/team.module";

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    InvitationsModule,
    ProjectsModule,
    TasksModule,
    NotificationsModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
