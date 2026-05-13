import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskActivityAction, TaskPriority, TaskStatus } from "@syncr/packages";
import { taskActivities } from "src/db/schema";
import { TaskActivitiesRepository } from "src/repositories/task-activities.repository";
import { TaskCommentsRepository } from "src/repositories/task-comments.repository";

import { AcceptanceCriteriaRepository } from "../../repositories/acceptance-criteria.repository";
import { LabelsRepository } from "../../repositories/labels.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { UsersRepository } from "../../repositories/users.repository";
import { CalendarSyncService } from "../calendar/calendar-sync.service";
import { NotificationsService } from "../notifications/notifications.service";
import {
  CreateTaskAcceptanceCriterionDto,
  CreateTaskCommentDto,
  CreateTaskDto,
  ReorderTasksDto,
  UpdateTaskAcceptanceCriterionDto,
  UpdateTaskDto,
} from "./tasks.dto";
import {
  mapAssignedTaskToDto,
  mapTaskActivityToDto,
  mapTaskCommentToDto,
  mapTaskToDto,
} from "./tasks.mapper";

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,
    private readonly taskActivitiesRepository: TaskActivitiesRepository,
    private readonly taskCommentsRepository: TaskCommentsRepository,
    private readonly acceptanceCriteriaRepository: AcceptanceCriteriaRepository,
    private readonly labelsRepository: LabelsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly calendarSyncService: CalendarSyncService,
  ) {}

  async getProjectTasks(companyId: number, projectId: number) {
    await this.ensureProjectExists(projectId, companyId);

    const tasks = await this.taskRepository.getProjectTasks(projectId, companyId);
    const tasksWithCriteria = await this.withTaskRelations(tasks);

    return tasksWithCriteria.map(mapTaskToDto);
  }

  async getAssignedTasks(companyId: number, userId: number) {
    const tasks = await this.taskRepository.getAssignedTasks(userId, companyId);
    const tasksWithCriteria = await this.withTaskRelations(tasks);

    return tasksWithCriteria.map(mapAssignedTaskToDto);
  }

  async createTask(
    companyId: number,
    projectId: number,
    userId: number,
    createTaskDto: CreateTaskDto,
  ) {
    await this.ensureProjectExists(projectId, companyId);

    if (createTaskDto.assigneeId) {
      await this.ensureAssigneeInProject(createTaskDto.assigneeId, projectId, companyId);
    }

    const status = createTaskDto.status ?? TaskStatus.Backlog;

    const position =
      createTaskDto.position ?? (await this.taskRepository.getNextPosition(projectId, status));

    const task = await this.taskRepository.createTask({
      projectId,
      name: this.getValidName(createTaskDto.name),
      description: createTaskDto.description?.trim() ?? "",
      assigneeId: createTaskDto.assigneeId ?? null,
      status,
      completedAt: status === TaskStatus.Done ? new Date() : null,
      priority: createTaskDto.priority ?? TaskPriority.Medium,
      position,
      endDate: createTaskDto.endDate ? this.getValidDate(createTaskDto.endDate, "End date") : null,
      estimateMinutes:
        createTaskDto.estimateMinutes !== undefined
          ? this.getValidEstimateMinutes(createTaskDto.estimateMinutes)
          : null,
    });

    if (createTaskDto.labelNames !== undefined) {
      await this.labelsRepository.setTaskLabels(
        task.id,
        projectId,
        this.getValidLabelNames(createTaskDto.labelNames),
      );
    }

    await this.taskActivitiesRepository.createTaskActivity({
      taskId: task.id,
      userId,
      action: TaskActivityAction.TaskCreated,
    });

    if (task.assignee?.id && task.assignee.id !== userId) {
      await this.notificationsService.notifyTaskAssigned(task.assignee.id, userId, task.id);
    }

    await this.calendarSyncService.syncTaskDeadline(task);

    const [taskWithCriteria] = await this.withTaskRelations([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async updateTask(
    companyId: number,
    projectId: number,
    taskId: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    const existingTask = await this.ensureTaskExists(taskId, projectId, companyId);

    const updateData: Parameters<TasksRepository["updateTask"]>[1] = {};

    if (updateTaskDto.name !== undefined) {
      updateData.name = this.getValidName(updateTaskDto.name);
    }

    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description?.trim() ?? "";
    }

    if (updateTaskDto.assigneeId !== undefined) {
      if (updateTaskDto.assigneeId !== null) {
        await this.ensureAssigneeInProject(updateTaskDto.assigneeId, projectId, companyId);
      }

      updateData.assigneeId = updateTaskDto.assigneeId;
    }

    if (updateTaskDto.status !== undefined) {
      updateData.status = updateTaskDto.status;
      updateData.completedAt =
        updateTaskDto.status === TaskStatus.Done
          ? (existingTask.completedAt ?? new Date())
          : null;
    }

    if (updateTaskDto.priority !== undefined) {
      updateData.priority = updateTaskDto.priority;
    }

    if (updateTaskDto.position !== undefined) {
      updateData.position = updateTaskDto.position;
    }

    if (updateTaskDto.endDate !== undefined) {
      updateData.endDate = updateTaskDto.endDate
        ? this.getValidDate(updateTaskDto.endDate, "End date")
        : null;
    }

    if (updateTaskDto.estimateMinutes !== undefined) {
      updateData.estimateMinutes = this.getValidEstimateMinutes(updateTaskDto.estimateMinutes);
    }

    const labelNames =
      updateTaskDto.labelNames !== undefined
        ? this.getValidLabelNames(updateTaskDto.labelNames)
        : undefined;

    if (Object.keys(updateData).length === 0 && labelNames === undefined) {
      throw new BadRequestException("No task fields to update");
    }

    const task =
      Object.keys(updateData).length > 0
        ? await this.taskRepository.updateTask(taskId, updateData)
        : await this.taskRepository.getTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (labelNames !== undefined) {
      await this.labelsRepository.setTaskLabels(taskId, projectId, labelNames);
    }

    const activityActions = this.getUpdateActivitiesAction(userId, updateTaskDto, existingTask);

    if (activityActions) {
      await this.taskActivitiesRepository.createTaskActivities(activityActions);
    }

    if (
      updateTaskDto.assigneeId !== undefined &&
      updateTaskDto.assigneeId !== null &&
      updateTaskDto.assigneeId !== existingTask.assignee?.id &&
      updateTaskDto.assigneeId !== userId
    ) {
      await this.notificationsService.notifyTaskAssigned(updateTaskDto.assigneeId, userId, taskId);
    }

    if (
      updateTaskDto.status !== undefined &&
      updateTaskDto.status !== existingTask.status &&
      task.assignee?.id &&
      task.assignee.id !== userId
    ) {
      await this.notificationsService.notifyTaskStatusChanged(task.assignee.id, userId, taskId);
    }

    if (
      updateTaskDto.endDate !== undefined &&
      this.hasDateChanged(updateData.endDate, existingTask.endDate) &&
      task.assignee?.id &&
      task.assignee.id !== userId
    ) {
      await this.notificationsService.notifyTaskDeadlineChanged(task.assignee.id, userId, taskId);
    }

    if (this.shouldSyncCalendar(updateTaskDto)) {
      if (
        updateTaskDto.assigneeId !== undefined &&
        updateTaskDto.assigneeId !== existingTask.assignee?.id
      ) {
        await this.calendarSyncService.deleteTaskEvents(taskId);
      }

      await this.calendarSyncService.syncTaskDeadline(task);
    }

    const [taskWithCriteria] = await this.withTaskRelations([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async reorderTasks(companyId: number, projectId: number, reorderTasksDto: ReorderTasksDto) {
    await this.ensureProjectExists(projectId, companyId);

    const taskIds = reorderTasksDto.tasks.map((task) => task.id);

    const uniqueTaskIds = new Set(taskIds);

    if (uniqueTaskIds.size !== taskIds.length) {
      throw new BadRequestException("Task reorder payload contains duplicate task IDs");
    }

    const tasks = await this.taskRepository.reorderTasks(
      projectId,
      companyId,
      reorderTasksDto.tasks,
    );

    if (!tasks) {
      throw new NotFoundException("One or more tasks were not found");
    }

    const tasksWithCriteria = await this.withTaskRelations(tasks);

    return tasksWithCriteria.map(mapTaskToDto);
  }

  async getTaskComments(companyId: number, projectId: number, taskId: number) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const comments = await this.taskCommentsRepository.getTaskComments(taskId);

    return comments.map(mapTaskCommentToDto);
  }

  async getTaskActivities(
    companyId: number,
    projectId: number,
    taskId: number,
    limit: number,
    offset: number,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const validatedLimit = this.getValidActivityLimit(limit);
    const validatedOffset = this.getValidActivityOffset(offset);
    const activities = await this.taskActivitiesRepository.getTaskActivities(
      taskId,
      validatedLimit,
      validatedOffset,
    );

    return {
      items: activities.slice(0, validatedLimit).map(mapTaskActivityToDto),
      hasMore: activities.length > validatedLimit,
    };
  }

  async createTaskComment(
    companyId: number,
    projectId: number,
    taskId: number,
    userId: number,
    createTaskCommentDto: CreateTaskCommentDto,
  ) {
    const task = await this.ensureTaskExists(taskId, projectId, companyId);

    const comment = await this.taskCommentsRepository.createTaskComment({
      taskId,
      userId,
      content: createTaskCommentDto.content,
    });

    await this.taskActivitiesRepository.createTaskActivity({
      taskId,
      userId,
      action: TaskActivityAction.TaskCommentAdded,
    });

    if (task.assignee?.id && task.assignee.id !== userId) {
      await this.notificationsService.notifyTaskCommented(task.assignee.id, userId, taskId);
    }

    return mapTaskCommentToDto(comment);
  }

  async createAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    userId: number,
    createAcceptanceCriterionDto: CreateTaskAcceptanceCriterionDto,
  ) {
    const existingTask = await this.ensureTaskExists(taskId, projectId, companyId);

    const position =
      createAcceptanceCriterionDto.position ??
      (await this.acceptanceCriteriaRepository.getNextPosition(taskId));

    await this.acceptanceCriteriaRepository.createAcceptanceCriterion({
      taskId,
      description: this.getValidAcceptanceCriterionDescription(
        createAcceptanceCriterionDto.description,
      ),
      isDone: createAcceptanceCriterionDto.isDone ?? false,
      position,
    });

    await this.taskActivitiesRepository.createTaskActivity({
      taskId,
      userId,
      action: TaskActivityAction.AcceptanceCriterionCreated,
    });

    if (existingTask.assignee?.id && existingTask.assignee.id !== userId) {
      await this.notificationsService.notifyTaskAcceptanceCriterionAdded(
        existingTask.assignee.id,
        userId,
        taskId,
      );
    }

    const task = await this.taskRepository.getTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const [taskWithCriteria] = await this.withTaskRelations([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async updateAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    criterionId: number,
    userId: number,
    updateAcceptanceCriterionDto: UpdateTaskAcceptanceCriterionDto,
  ) {
    await this.ensureAcceptanceCriterionExists(criterionId, taskId, projectId, companyId);

    const updateData: Parameters<AcceptanceCriteriaRepository["updateAcceptanceCriterion"]>[1] = {};

    if (updateAcceptanceCriterionDto.description !== undefined) {
      updateData.description = this.getValidAcceptanceCriterionDescription(
        updateAcceptanceCriterionDto.description,
      );
    }

    if (updateAcceptanceCriterionDto.isDone !== undefined) {
      updateData.isDone = updateAcceptanceCriterionDto.isDone;
    }

    if (updateAcceptanceCriterionDto.position !== undefined) {
      updateData.position = updateAcceptanceCriterionDto.position;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No acceptance criterion fields to update");
    }

    const criterion = await this.acceptanceCriteriaRepository.updateAcceptanceCriterion(
      criterionId,
      updateData,
    );

    if (!criterion) {
      throw new NotFoundException("Acceptance criterion not found");
    }

    await this.taskActivitiesRepository.createTaskActivity({
      taskId,
      userId,
      action: TaskActivityAction.AcceptanceCriterionUpdated,
    });

    const task = await this.taskRepository.getTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const [taskWithCriteria] = await this.withTaskRelations([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async deleteAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    criterionId: number,
    userId: number,
  ) {
    await this.ensureAcceptanceCriterionExists(criterionId, taskId, projectId, companyId);

    const criterion =
      await this.acceptanceCriteriaRepository.deleteAcceptanceCriterion(criterionId);

    if (!criterion) {
      throw new NotFoundException("Acceptance criterion not found");
    }

    await this.taskActivitiesRepository.createTaskActivity({
      taskId,
      userId,
      action: TaskActivityAction.AcceptanceCriterionDeleted,
    });

    const task = await this.taskRepository.getTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const [taskWithCriteria] = await this.withTaskRelations([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async deleteTask(companyId: number, projectId: number, taskId: number) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    await this.calendarSyncService.deleteTaskEvents(taskId);

    const task = await this.taskRepository.deleteTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }
  }

  private async ensureProjectExists(projectId: number, companyId: number) {
    const project = await this.taskRepository.getProject(projectId, companyId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }
  }

  private async ensureTaskExists(taskId: number, projectId: number, companyId: number) {
    const task = await this.taskRepository.getCompanyTask(taskId, projectId, companyId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  private hasDateChanged(nextDate: Date | null | undefined, previousDate: Date | null) {
    if (nextDate === undefined) {
      return false;
    }

    return nextDate?.getTime() !== previousDate?.getTime();
  }

  private shouldSyncCalendar(updateTaskDto: UpdateTaskDto) {
    return (
      updateTaskDto.name !== undefined ||
      updateTaskDto.description !== undefined ||
      updateTaskDto.assigneeId !== undefined ||
      updateTaskDto.endDate !== undefined
    );
  }

  private async ensureAcceptanceCriterionExists(
    criterionId: number,
    taskId: number,
    projectId: number,
    companyId: number,
  ) {
    const criterion = await this.acceptanceCriteriaRepository.getAcceptanceCriterion(
      criterionId,
      taskId,
      projectId,
      companyId,
    );

    if (!criterion) {
      throw new NotFoundException("Acceptance criterion not found");
    }

    return criterion;
  }

  private async withAcceptanceCriteria<T extends { id: number }>(tasks: T[]) {
    if (tasks.length === 0) {
      return [];
    }

    const criteria = await this.acceptanceCriteriaRepository.getByTaskIds(
      tasks.map((task) => task.id),
    );
    const criteriaByTaskId = new Map<number, typeof criteria>();

    for (const criterion of criteria) {
      const taskCriteria = criteriaByTaskId.get(criterion.taskId) ?? [];
      taskCriteria.push(criterion);
      criteriaByTaskId.set(criterion.taskId, taskCriteria);
    }

    return tasks.map((task) => ({
      ...task,
      acceptanceCriteria: criteriaByTaskId.get(task.id) ?? [],
    }));
  }

  private async withLabels<T extends { id: number }>(tasks: T[]) {
    if (tasks.length === 0) {
      return [];
    }

    const labels = await this.labelsRepository.getLabelsByTaskIds(tasks.map((task) => task.id));
    const labelsByTaskId = new Map<number, typeof labels>();

    for (const label of labels) {
      const taskLabels = labelsByTaskId.get(label.taskId) ?? [];
      taskLabels.push(label);
      labelsByTaskId.set(label.taskId, taskLabels);
    }

    return tasks.map((task) => ({
      ...task,
      labels: (labelsByTaskId.get(task.id) ?? []).map((label) => ({
        id: label.id,
        projectId: label.projectId,
        name: label.name,
      })),
    }));
  }

  private async withTaskRelations<T extends { id: number }>(tasks: T[]) {
    return await this.withLabels(await this.withAcceptanceCriteria(tasks));
  }

  private async ensureAssigneeInCompany(assigneeId: number, companyId: number) {
    const isUserInCompany = await this.usersRepository.isUserInCompany(assigneeId, companyId);

    if (!isUserInCompany) {
      throw new BadRequestException("Task assignee must belong to the company");
    }
  }

  private async ensureAssigneeInProject(assigneeId: number, projectId: number, companyId: number) {
    await this.ensureAssigneeInCompany(assigneeId, companyId);

    const isUserAssignedToProject = await this.usersRepository.isUserAssignedToProject(
      assigneeId,
      projectId,
      companyId,
    );

    if (!isUserAssignedToProject) {
      throw new BadRequestException("Task assignee must be assigned to the project");
    }
  }

  private getValidName(name: string) {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      throw new BadRequestException("Task name must be at least 2 characters long");
    }

    return trimmedName;
  }

  private getValidAcceptanceCriterionDescription(description: string) {
    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 2) {
      throw new BadRequestException(
        "Acceptance criterion description must be at least 2 characters long",
      );
    }

    return trimmedDescription;
  }

  private getValidDate(value: string, label: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${label} is invalid`);
    }

    return date;
  }

  private getValidEstimateMinutes(value: number | null) {
    if (value === null) {
      return null;
    }

    if (!Number.isInteger(value) || value < 0 || value % 15 !== 0) {
      throw new BadRequestException("Task estimate must be divisible by 15 minutes");
    }

    return value;
  }

  private getValidActivityLimit(value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException("Limit must be a positive number");
    }

    return value;
  }

  private getValidActivityOffset(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException("Offset must be a non-negative number");
    }

    return value;
  }

  private getValidLabelNames(labelNames: string[]) {
    const names = labelNames.map((name) => name.trim().toLowerCase()).filter(Boolean);

    return [...new Set(names)];
  }

  private getUpdateActivitiesAction(
    userId: number,
    updateTaskDto: UpdateTaskDto,
    previousTask: Awaited<ReturnType<TasksService["ensureTaskExists"]>>,
  ) {
    const taskId = previousTask.id;
    const base = { taskId, userId };
    const updatedActions: (typeof taskActivities.$inferInsert)[] = [];

    if (updateTaskDto.name !== undefined && updateTaskDto.name.trim() !== previousTask.name) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskNameUpdated,
        newValue: updateTaskDto.name,
        previousValue: previousTask.name,
      });
    }

    if (updateTaskDto.description !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskDescriptionUpdated,
      });
    }

    if (updateTaskDto.assigneeId !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskAssigneeUpdated,
      });
    }

    if (updateTaskDto.status !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskStatusUpdated,
      });
    }

    if (updateTaskDto.priority !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskPriorityUpdated,
      });
    }

    if (updateTaskDto.endDate !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskDeadlineUpdated,
      });
    }

    if (
      updateTaskDto.estimateMinutes !== undefined &&
      updateTaskDto.estimateMinutes !== previousTask.estimateMinutes
    ) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskEstimateUpdated,
        newValue: updateTaskDto.estimateMinutes?.toString() ?? "0",
        previousValue: previousTask.estimateMinutes?.toString() ?? "0",
      });
    }

    if (updateTaskDto.labelNames !== undefined) {
      updatedActions.push({
        ...base,
        action: TaskActivityAction.TaskLabelsUpdated,
      });
    }

    return updatedActions;
  }
}
