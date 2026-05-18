import { Logger } from "@nestjs/common";
import {
  ConversationType,
  NotificationEntityType,
  NotificationType,
  ProjectStatus,
  RoleKey,
  TaskActivityAction,
  TaskPriority,
  TaskStatus,
} from "@syncr/packages";
import { eq } from "drizzle-orm";

import { DEMO_USER_EMAIL } from "../common/demo";
import { type AppDb, demoDb } from "../db/drizzle";
import {
  companies,
  conversationParticipants,
  conversations,
  messages,
  notifications,
  projectLabels,
  projects,
  projectUsers,
  roles,
  taskAcceptanceCriteria,
  taskActivities,
  taskComments,
  taskLabels,
  tasks,
  userCompanyRoles,
  users,
} from "../db/schema";

type SeedRoles = (targetDb: AppDb) => Promise<void>;

const dayOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(10, 0, 0, 0);
  return date;
};

const addDays = (base: Date, days: number) => {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
};

const DEMO_PROJECTS = [
  {
    name: "Customer Portal Relaunch",
    status: ProjectStatus.Active,
    startOffset: -42,
    endOffset: 35,
    managerIndex: 1,
  },
  {
    name: "Mobile Sprint",
    status: ProjectStatus.Active,
    startOffset: -18,
    endOffset: 24,
    managerIndex: 2,
  },
  {
    name: "Analytics Foundation",
    status: ProjectStatus.Paused,
    startOffset: -64,
    endOffset: 58,
    managerIndex: 0,
  },
  {
    name: "Billing Reliability",
    status: ProjectStatus.Active,
    startOffset: -28,
    endOffset: 42,
    managerIndex: 5,
  },
  {
    name: "Workspace Automation",
    status: ProjectStatus.Active,
    startOffset: -9,
    endOffset: 31,
    managerIndex: 1,
  },
  {
    name: "Design System Refresh",
    status: ProjectStatus.Completed,
    startOffset: -110,
    endOffset: -7,
    managerIndex: 2,
  },
] as const;

const DEMO_TASK_NAMES = [
  "Audit onboarding funnel",
  "Build account overview cards",
  "Wire invitation reminders",
  "Polish empty states",
  "Tune task calendar queries",
  "Add regression coverage",
  "Ship responsive header",
  "Review notification copy",
  "Document project handoff checklist",
  "Improve slow dashboard summary query",
  "Add keyboard flow to task details",
  "Rework overdue task filters",
  "Validate role permissions matrix",
  "Refine mobile kanban spacing",
  "Prepare release readiness report",
  "Add loading states to activity feed",
  "Normalize team member workload data",
  "Reconcile calendar sync failures",
] as const;

const DEMO_TASK_DESCRIPTIONS = [
  "Trace the current workflow, capture gaps, and leave notes that make the next implementation step obvious.",
  "Implement the visible UI and connect it to the existing API contracts without changing unrelated behavior.",
  "Review edge cases from recent demos and add enough coverage to prevent regressions.",
  "Coordinate with design and product notes, then update the task with the agreed scope.",
  "Investigate the production-shaped path and record the fix in a way the whole team can follow.",
] as const;

const DEMO_LABELS = [
  "bug",
  "feature",
  "ux",
  "backend",
  "ops",
  "research",
  "release",
  "docs",
] as const;

const updateExistingDemoUserNames = async () => {
  if (!demoDb) {
    return;
  }

  await Promise.all([
    demoDb
      .update(users)
      .set({ name: "Jules", surname: "Winnfield" })
      .where(eq(users.email, DEMO_USER_EMAIL)),
    demoDb
      .update(users)
      .set({ email: "mia.wallace@syncr.cc", name: "Mia", surname: "Wallace" })
      .where(eq(users.email, "maya.chen@syncr.cc")),
    demoDb
      .update(users)
      .set({ email: "vincent.vega@syncr.cc", name: "Vincent", surname: "Vega" })
      .where(eq(users.email, "noah.patel@syncr.cc")),
    demoDb
      .update(users)
      .set({ email: "django.freeman@syncr.cc", name: "Django", surname: "Freeman" })
      .where(eq(users.email, "sofia.rivera@syncr.cc")),
    demoDb
      .update(users)
      .set({ email: "aldo.raine@syncr.cc", name: "Aldo", surname: "Raine" })
      .where(eq(users.email, "liam.okafor@syncr.cc")),
    demoDb
      .update(users)
      .set({ email: "django.freeman@syncr.cc", name: "Django", surname: "Freeman" })
      .where(eq(users.email, "jackie.brown@syncr.cc")),
    demoDb
      .update(users)
      .set({ email: "aldo.raine@syncr.cc", name: "Aldo", surname: "Raine" })
      .where(eq(users.email, "beatrix.kiddo@syncr.cc")),
  ]);
};

export const seedDemoData = async (seedRoles: SeedRoles) => {
  if (!demoDb) {
    Logger.warn("DEMO_DATABASE_URL is not configured. Demo database seeding skipped.");
    return;
  }

  await seedRoles(demoDb);

  const [existingDemoUser] = await demoDb
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, DEMO_USER_EMAIL))
    .limit(1);

  if (existingDemoUser) {
    await updateExistingDemoUserNames();

    Logger.log("Demo data already seeded.");
    return;
  }

  await demoDb.transaction(async (tx) => {
    const [ownerRole] = await tx.select().from(roles).where(eq(roles.key, RoleKey.Owner)).limit(1);
    const [managerRole] = await tx
      .select()
      .from(roles)
      .where(eq(roles.key, RoleKey.ProjectManager))
      .limit(1);
    const [developerRole] = await tx
      .select()
      .from(roles)
      .where(eq(roles.key, RoleKey.Developer))
      .limit(1);

    const seededUsers = await tx
      .insert(users)
      .values([
        {
          email: DEMO_USER_EMAIL,
          name: "Jules",
          surname: "Winnfield",
          password: "demo",
          birthday: "1992-05-22",
          weeklyLoadMinutes: 40 * 60,
        },
        {
          email: "mia.wallace@syncr.cc",
          name: "Mia",
          surname: "Wallace",
          password: "demo",
          birthday: "1990-06-04",
          weeklyLoadMinutes: 36 * 60,
        },
        {
          email: "vincent.vega@syncr.cc",
          name: "Vincent",
          surname: "Vega",
          password: "demo",
          birthday: "1988-06-18",
          weeklyLoadMinutes: 38 * 60,
        },
        {
          email: "django.freeman@syncr.cc",
          name: "Django",
          surname: "Freeman",
          password: "demo",
          birthday: "1995-07-02",
          weeklyLoadMinutes: 32 * 60,
        },
        {
          email: "aldo.raine@syncr.cc",
          name: "Aldo",
          surname: "Raine",
          password: "demo",
          birthday: "1991-07-12",
          weeklyLoadMinutes: 40 * 60,
        },
        {
          email: "shosanna.dreyfus@syncr.cc",
          name: "Shosanna",
          surname: "Dreyfus",
          password: "demo",
          birthday: "1993-08-08",
          weeklyLoadMinutes: 34 * 60,
        },
        {
          email: "calvin.candie@syncr.cc",
          name: "Calvin",
          surname: "Candie",
          password: "demo",
          birthday: "1987-09-16",
          weeklyLoadMinutes: 30 * 60,
        },
        {
          email: "mr.pink@syncr.cc",
          name: "Mr.",
          surname: "Pink",
          password: "demo",
          birthday: "1989-11-03",
          weeklyLoadMinutes: 36 * 60,
        },
      ])
      .returning();

    const [company] = await tx
      .insert(companies)
      .values({ name: "Syncr Demo Workspace" })
      .returning();

    await tx.insert(userCompanyRoles).values(
      seededUsers.map((user, index) => ({
        userId: user.id,
        companyId: company.id,
        roleId: index === 0 ? ownerRole.id : index <= 3 ? managerRole.id : developerRole.id,
      })),
    );

    const seededProjects = await tx
      .insert(projects)
      .values(
        DEMO_PROJECTS.map((project) => ({
          name: project.name,
          companyId: company.id,
          managerId: seededUsers[project.managerIndex].id,
          status: project.status,
          startDate: dayOffset(project.startOffset),
          endDate: dayOffset(project.endOffset),
        })),
      )
      .returning();

    await tx
      .insert(projectUsers)
      .values(
        seededProjects.flatMap((project, projectIndex) =>
          seededUsers
            .filter((_, userIndex) => (projectIndex + userIndex) % 4 !== 0 || userIndex < 3)
            .map((user) => ({ projectId: project.id, userId: user.id })),
        ),
      );

    const labelRows = await tx
      .insert(projectLabels)
      .values(
        seededProjects.flatMap((project) =>
          DEMO_LABELS.map((name) => ({
            projectId: project.id,
            name,
          })),
        ),
      )
      .returning();

    const seededTasks = await tx
      .insert(tasks)
      .values(
        seededProjects.flatMap((project, projectIndex) => {
          return DEMO_TASK_NAMES.map((name, index) => ({
            name: `${name} - ${project.name}`,
            description:
              DEMO_TASK_DESCRIPTIONS[(index + projectIndex) % DEMO_TASK_DESCRIPTIONS.length],
            projectId: project.id,
            assigneeId: seededUsers[(index + projectIndex) % seededUsers.length].id,
            status: [
              TaskStatus.Backlog,
              TaskStatus.Todo,
              TaskStatus.InProgress,
              TaskStatus.Review,
              TaskStatus.Done,
            ][(index + projectIndex) % 5],
            priority: [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High][
              (index + projectIndex) % 3
            ],
            position: index,
            endDate: dayOffset(index - 8 + projectIndex * 4),
            completedAt: (index + projectIndex) % 5 === 4 ? dayOffset(-index - projectIndex) : null,
            estimateMinutes: [45, 60, 90, 120, 180, 240, 360][(index + projectIndex) % 7],
          }));
        }),
      )
      .returning();

    await tx.insert(taskAcceptanceCriteria).values(
      seededTasks.flatMap((task) => [
        {
          taskId: task.id,
          description: "Acceptance path is covered",
          isDone: task.status === TaskStatus.Done,
          position: 0,
        },
        {
          taskId: task.id,
          description: "Edge cases are reviewed",
          isDone: task.status === TaskStatus.Review || task.status === TaskStatus.Done,
          position: 1,
        },
      ]),
    );

    await tx.insert(taskComments).values(
      seededTasks.slice(0, 54).map((task, index) => ({
        taskId: task.id,
        userId: seededUsers[index % seededUsers.length].id,
        content: [
          "Shared the latest notes in the project channel.",
          "This is ready for a second pass.",
          "I split the remaining work into smaller follow-ups.",
          "Design review is reflected in the current scope.",
          "The remaining risk is called out in the acceptance criteria.",
          "I checked this against the demo workflow and updated the estimate.",
          "Backend and UI changes are aligned for the next review.",
          "Leaving this here so the next person has the decision context.",
        ][index % 8],
        createdAt: addDays(dayOffset(-7), index),
      })),
    );

    await tx.insert(taskActivities).values(
      seededTasks.flatMap((task, index) => [
        {
          taskId: task.id,
          userId: seededUsers[index % seededUsers.length].id,
          action: TaskActivityAction.TaskCreated,
          createdAt: addDays(dayOffset(-14), index),
        },
        {
          taskId: task.id,
          userId: seededUsers[(index + 1) % seededUsers.length].id,
          action: TaskActivityAction.TaskStatusUpdated,
          previousValue: TaskStatus.Backlog,
          newValue: task.status,
          createdAt: addDays(dayOffset(-10), index),
        },
      ]),
    );

    await tx.insert(notifications).values(
      seededTasks.slice(0, 24).map((task, index) => ({
        recipientId:
          DEMO_USER_EMAIL === seededUsers[index % seededUsers.length].email
            ? seededUsers[1].id
            : seededUsers[0].id,
        actorId: seededUsers[(index + 2) % seededUsers.length].id,
        type: NotificationType.TaskAssigned,
        entityType: NotificationEntityType.Task,
        entityId: task.id,
        metadata: { taskName: task.name, projectId: task.projectId },
        isRead: index % 3 === 0,
        createdAt: addDays(dayOffset(-4), index),
      })),
    );

    const [conversation] = await tx
      .insert(conversations)
      .values({
        companyId: company.id,
        type: ConversationType.Group,
        title: "Relaunch Standup",
        createdById: seededUsers[0].id,
      })
      .returning();

    await tx
      .insert(conversationParticipants)
      .values(seededUsers.map((user) => ({ conversationId: conversation.id, userId: user.id })));

    const seededMessages = await tx
      .insert(messages)
      .values(
        [
          "Morning. Portal QA is green except the billing edge case.",
          "I can pick that up after the dashboard review.",
          "Great. I moved the analytics work out of this release.",
          "Demo data is looking full enough for the walkthrough.",
        ].map((content, index) => ({
          conversationId: conversation.id,
          senderId: seededUsers[index % seededUsers.length].id,
          content,
          createdAt: addDays(dayOffset(-2), index),
        })),
      )
      .returning();

    await tx
      .update(conversations)
      .set({ lastMessageId: seededMessages[seededMessages.length - 1].id })
      .where(eq(conversations.id, conversation.id));

    if (labelRows.length > 0) {
      await tx.insert(taskLabels).values(
        seededTasks.slice(0, 72).flatMap((task, index) => [
          {
            taskId: task.id,
            labelId: labelRows[index % labelRows.length].id,
          },
          {
            taskId: task.id,
            labelId: labelRows[(index + 3) % labelRows.length].id,
          },
        ]),
      );
    }
  });

  Logger.log("Demo data seeded!");
};
