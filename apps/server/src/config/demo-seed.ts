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
        roleId: index === 0 ? ownerRole.id : index <= 2 ? managerRole.id : developerRole.id,
      })),
    );

    const seededProjects = await tx
      .insert(projects)
      .values([
        {
          name: "Customer Portal Relaunch",
          companyId: company.id,
          managerId: seededUsers[1].id,
          status: ProjectStatus.Active,
          startDate: dayOffset(-42),
          endDate: dayOffset(35),
        },
        {
          name: "Mobile Sprint",
          companyId: company.id,
          managerId: seededUsers[2].id,
          status: ProjectStatus.Active,
          startDate: dayOffset(-18),
          endDate: dayOffset(24),
        },
        {
          name: "Analytics Foundation",
          companyId: company.id,
          managerId: seededUsers[0].id,
          status: ProjectStatus.Paused,
          startDate: dayOffset(-64),
          endDate: dayOffset(58),
        },
      ])
      .returning();

    await tx
      .insert(projectUsers)
      .values(
        seededProjects.flatMap((project, projectIndex) =>
          seededUsers
            .filter((_, userIndex) => projectIndex !== 2 || userIndex !== 4)
            .map((user) => ({ projectId: project.id, userId: user.id })),
        ),
      );

    const labelRows = await tx
      .insert(projectLabels)
      .values(
        seededProjects.flatMap((project) =>
          ["bug", "feature", "ux", "backend", "ops"].map((name) => ({
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
          const names = [
            "Audit onboarding funnel",
            "Build account overview cards",
            "Wire invitation reminders",
            "Polish empty states",
            "Tune task calendar queries",
            "Add regression coverage",
            "Ship responsive header",
            "Review notification copy",
          ];

          return names.map((name, index) => ({
            name: projectIndex === 0 ? name : `${name} ${projectIndex + 1}`,
            description:
              "Demo task with enough context for project planning, assignment, comments, and activity history.",
            projectId: project.id,
            assigneeId: seededUsers[(index + projectIndex) % seededUsers.length].id,
            status: [
              TaskStatus.Backlog,
              TaskStatus.Todo,
              TaskStatus.InProgress,
              TaskStatus.Review,
              TaskStatus.Done,
            ][index % 5],
            priority: [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High][index % 3],
            position: index,
            endDate: dayOffset(index - 2 + projectIndex * 3),
            completedAt: index % 5 === 4 ? dayOffset(-index) : null,
            estimateMinutes: [60, 120, 180, 240][index % 4],
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
      seededTasks.slice(0, 14).map((task, index) => ({
        taskId: task.id,
        userId: seededUsers[index % seededUsers.length].id,
        content: [
          "Shared the latest notes in the project channel.",
          "This is ready for a second pass.",
          "I split the remaining work into smaller follow-ups.",
          "Design review is reflected in the current scope.",
        ][index % 4],
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
      seededTasks.slice(0, 8).map((task, index) => ({
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
        seededTasks.slice(0, 18).map((task, index) => ({
          taskId: task.id,
          labelId: labelRows[index % labelRows.length].id,
        })),
      );
    }
  });

  Logger.log("Demo data seeded!");
};
