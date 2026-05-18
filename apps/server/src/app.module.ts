import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DemoReadonlyGuard } from "./common/guards/demo-readonly.guard";
import { DbModule } from "./db/db.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { InvitationsModule } from "./modules/invitations/invitations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TeamModule } from "./modules/team/team.module";

@Module({
  imports: [
    DbModule,
    AuthModule,
    CompaniesModule,
    InvitationsModule,
    ProjectsModule,
    TasksModule,
    NotificationsModule,
    TeamModule,
    ConversationsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: DemoReadonlyGuard,
    },
  ],
})
export class AppModule {}
