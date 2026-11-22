import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { TaskStatus } from "@syncr/packages";

import { runInDemoContext } from "../../common/demo";
import { CONFIG } from "../../config/configuration";
import { DemoActivityRepository } from "../../repositories/demo-activity.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { ConversationsService } from "../conversations/conversations.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { TasksService } from "../tasks/tasks.service";

type DemoWorkspace = { userId: number; companyId: number };
type DemoTask = Awaited<ReturnType<DemoActivityRepository["getActiveProjectTasks"]>>[number];

const MIN_DELAY_MS = 15_000;
const MAX_DELAY_MS = 35_000;
const OWN_TASK_CHANCE = 0.4;
const MAX_DONE_SHARE = 0.6;

const TASK_FLOW: TaskStatus[] = [
  TaskStatus.Backlog,
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Review,
  TaskStatus.Done,
];

const COMMENTS = [
  "Pushed a fix for this, could you take a look?",
  "Left a few notes on the edge cases.",
  "Blocked on the API change, will pick it back up tomorrow.",
  "Looks good to me, nice work!",
  "I added screenshots to the description.",
  "Can we split this into two smaller tasks?",
  "QA found a small regression on mobile.",
  "Updated the estimate after digging into it.",
];

const MESSAGES = [
  "Hey, do you have a minute to sync on the release?",
  "Standup moved to 10:30 today.",
  "I just merged the dashboard changes 🎉",
  "Can you review my task when you get a chance?",
  "Lunch anyone?",
  "The staging build is green again.",
  "Heads up: design review is on Thursday.",
];

const pickRandom = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const randomDelay = () => MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

// simulates teammates working in the demo workspace while someone is watching it
@Injectable()
export class DemoActivityService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(DemoActivityService.name);
  private timeout: NodeJS.Timeout | null = null;

  constructor(
    private readonly demoActivityRepository: DemoActivityRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly tasksService: TasksService,
    private readonly conversationsService: ConversationsService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  onApplicationBootstrap() {
    if (CONFIG.DEMO_DATABASE_URL) {
      this.scheduleNextEvent();
    }
  }

  onModuleDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private scheduleNextEvent() {
    this.timeout = setTimeout(() => {
      void this.runEvent().finally(() => this.scheduleNextEvent());
    }, randomDelay());
  }

  private async runEvent() {
    if (!this.realtimeGateway.hasDemoViewers()) {
      return;
    }

    try {
      await runInDemoContext(true, () => this.runRandomEvent());
    } catch (error) {
      this.logger.warn(`Demo event failed: ${(error as Error).message}`);
    }
  }

  private async runRandomEvent() {
    const workspace = await this.demoActivityRepository.getDemoWorkspace();

    if (!workspace) {
      return;
    }

    const moveTask = () => this.moveTask(workspace);
    const commentOnTask = () => this.commentOnTask(workspace);
    const sendMessage = () => this.sendMessage(workspace);

    const runEvent = pickRandom([
      moveTask,
      moveTask,
      moveTask,
      commentOnTask,
      commentOnTask,
      sendMessage,
    ]);

    await runEvent();
  }

  private async moveTask(workspace: DemoWorkspace) {
    const tasks = await this.demoActivityRepository.getActiveProjectTasks(workspace.companyId);
    const doneTasks = tasks.filter((task) => task.status === TaskStatus.Done);
    const openTasks = tasks.filter((task) => task.status !== TaskStatus.Done);

    // the demo data is never reset, so reopen work instead of letting every task drift to done
    const shouldReopen = openTasks.length === 0 || doneTasks.length > tasks.length * MAX_DONE_SHARE;
    const task = this.pickTask(shouldReopen ? doneTasks : openTasks, workspace.userId);

    if (!task) {
      return;
    }

    const actorId = await this.pickActor(task, workspace.userId);

    if (!actorId) {
      return;
    }

    const status = shouldReopen ? TaskStatus.Todo : TASK_FLOW[TASK_FLOW.indexOf(task.status) + 1];
    const position = await this.tasksRepository.getNextPosition(task.projectId, status);

    await this.tasksService.updateTask(workspace.companyId, task.projectId, task.id, actorId, {
      status,
      position,
    });
  }

  private async commentOnTask(workspace: DemoWorkspace) {
    const tasks = await this.demoActivityRepository.getActiveProjectTasks(workspace.companyId);
    const task = this.pickTask(tasks, workspace.userId);

    if (!task) {
      return;
    }

    const actorId = await this.pickActor(task, workspace.userId);

    if (!actorId) {
      return;
    }

    await this.tasksService.createTaskComment(
      workspace.companyId,
      task.projectId,
      task.id,
      actorId,
      { content: pickRandom(COMMENTS) },
    );
  }

  private async sendMessage(workspace: DemoWorkspace) {
    const partners = await this.demoActivityRepository.getConversationPartners(workspace.userId);
    const partner = pickRandom(partners);

    if (!partner) {
      return;
    }

    await this.conversationsService.sendMessage(partner.conversationId, partner.userId, {
      content: pickRandom(MESSAGES),
    });
  }

  // leans towards the demo user's own tasks so their notifications fire too
  private pickTask(tasks: DemoTask[], demoUserId: number) {
    const ownTasks = tasks.filter((task) => task.assigneeId === demoUserId);

    return pickRandom(ownTasks.length > 0 && Math.random() < OWN_TASK_CHANCE ? ownTasks : tasks);
  }

  private async pickActor(task: DemoTask, demoUserId: number) {
    if (task.assigneeId && task.assigneeId !== demoUserId) {
      return task.assigneeId;
    }

    const memberIds = await this.demoActivityRepository.getProjectMemberIds(task.projectId);

    return pickRandom(memberIds.filter((memberId) => memberId !== demoUserId));
  }
}
