import { Module } from "@nestjs/common";

import { DemoActivityRepository } from "../../repositories/demo-activity.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { ConversationsModule } from "../conversations/conversations.module";
import { RealtimeModule } from "../realtime/realtime.module";
import { TasksModule } from "../tasks/tasks.module";
import { DemoActivityService } from "./demo-activity.service";

@Module({
  imports: [TasksModule, ConversationsModule, RealtimeModule],
  providers: [DemoActivityService, DemoActivityRepository, TasksRepository],
})
export class DemoModule {}
