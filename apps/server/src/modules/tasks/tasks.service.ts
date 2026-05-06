import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskPriority, TaskStatus } from "@syncr/packages";
import { TaskCommentsRepository } from "src/repositories/task-comments.repository";

import { AcceptanceCriteriaRepository } from "../../repositories/acceptance-criteria.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import {
  CreateTaskAcceptanceCriterionDto,
  CreateTaskCommentDto,
  CreateTaskDto,
  ReorderTasksDto,
  SetTaskAssigneeDto,
  UpdateTaskAcceptanceCriterionDto,
  UpdateTaskDto,
} from "./tasks.dto";
import { mapTaskCommentToDto, mapTaskToDto } from "./tasks.mapper";

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,
    private readonly taskCommentsRepository: TaskCommentsRepository,
    private readonly acceptanceCriteriaRepository: AcceptanceCriteriaRepository,
  ) {}

  async getProjectTasks(companyId: number, projectId: number) {
    await this.ensureProjectExists(projectId, companyId);

    const tasks = await this.taskRepository.getProjectTasks(projectId, companyId);
    const tasksWithCriteria = await this.withAcceptanceCriteria(tasks);

    return tasksWithCriteria.map(mapTaskToDto);
  }

  async createTask(companyId: number, projectId: number, createTaskDto: CreateTaskDto) {
    await this.ensureProjectExists(projectId, companyId);
    await this.ensureAssigneeInProject(createTaskDto.assigneeId, projectId, companyId);

    const status = createTaskDto.status ?? TaskStatus.Backlog;

    const position =
      createTaskDto.position ?? (await this.taskRepository.getNextPosition(projectId, status));

    const task = await this.taskRepository.createTask({
      projectId,
      name: this.getValidName(createTaskDto.name),
      description: createTaskDto.description?.trim() ?? "",
      assigneeId: createTaskDto.assigneeId,
      status,
      priority: createTaskDto.priority ?? TaskPriority.Medium,
      position,
      endDate: createTaskDto.endDate ? this.getValidDate(createTaskDto.endDate, "End date") : null,
    });

    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async updateTask(
    companyId: number,
    projectId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

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

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No task fields to update");
    }

    const task = await this.taskRepository.updateTask(taskId, updateData);
    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

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

    const tasksWithCriteria = await this.withAcceptanceCriteria(tasks);

    return tasksWithCriteria.map(mapTaskToDto);
  }

  async getTaskComments(companyId: number, projectId: number, taskId: number) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const comments = await this.taskCommentsRepository.getTaskComments(taskId);

    return comments.map(mapTaskCommentToDto);
  }

  async createTaskComment(
    companyId: number,
    projectId: number,
    taskId: number,
    userId: number,
    createTaskCommentDto: CreateTaskCommentDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const comment = await this.taskCommentsRepository.createTaskComment({
      taskId,
      userId,
      content: createTaskCommentDto.content,
    });

    return mapTaskCommentToDto(comment);
  }

  async setAssignee(
    companyId: number,
    projectId: number,
    taskId: number,
    setTaskAssigneeDto: SetTaskAssigneeDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);
    if (setTaskAssigneeDto.assigneeId === undefined) {
      throw new BadRequestException("Task assignee field is required");
    }

    if (setTaskAssigneeDto.assigneeId !== null) {
      await this.ensureAssigneeInProject(setTaskAssigneeDto.assigneeId, projectId, companyId);
    }

    const task = await this.taskRepository.updateTask(taskId, {
      assigneeId: setTaskAssigneeDto.assigneeId,
    });
    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async createAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    createAcceptanceCriterionDto: CreateTaskAcceptanceCriterionDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

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

    const task = await this.taskRepository.getTask(taskId, projectId, companyId);
    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async updateAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    criterionId: number,
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

    await this.acceptanceCriteriaRepository.updateAcceptanceCriterion(criterionId, updateData);

    const task = await this.taskRepository.getTask(taskId, projectId, companyId);
    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async deleteAcceptanceCriterion(
    companyId: number,
    projectId: number,
    taskId: number,
    criterionId: number,
  ) {
    await this.ensureAcceptanceCriterionExists(criterionId, taskId, projectId, companyId);

    await this.acceptanceCriteriaRepository.deleteAcceptanceCriterion(criterionId);

    const task = await this.taskRepository.getTask(taskId, projectId, companyId);
    const [taskWithCriteria] = await this.withAcceptanceCriteria([task]);

    return mapTaskToDto(taskWithCriteria);
  }

  async deleteTask(companyId: number, projectId: number, taskId: number) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    await this.taskRepository.deleteTask(taskId);
  }

  private async ensureProjectExists(projectId: number, companyId: number) {
    const project = await this.taskRepository.getProject(projectId, companyId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }
  }

  private async ensureTaskExists(taskId: number, projectId: number, companyId: number) {
    const task = await this.taskRepository.getTask(taskId, projectId, companyId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
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

  private async ensureAssigneeInCompany(assigneeId: number, companyId: number) {
    const isUserInCompany = await this.taskRepository.isUserInCompany(assigneeId, companyId);

    if (!isUserInCompany) {
      throw new BadRequestException("Task assignee must belong to the company");
    }
  }

  private async ensureAssigneeInProject(assigneeId: number, projectId: number, companyId: number) {
    await this.ensureAssigneeInCompany(assigneeId, companyId);

    const isUserAssignedToProject = await this.taskRepository.isUserAssignedToProject(
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
}
