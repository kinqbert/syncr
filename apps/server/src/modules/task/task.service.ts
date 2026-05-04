import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskPriority, TaskStatus } from "@syncr/packages";
import { TaskRepository } from "src/repositories/task.repository";

import { CreateTaskDto, ReorderTasksDto, UpdateTaskDto, UpdateTaskStatusDto } from "./task.dto";
import { mapTaskToDto } from "./task.mapper";

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getProjectTasks(companyId: number, projectId: number) {
    await this.ensureProjectExists(projectId, companyId);

    const tasks = await this.taskRepository.getProjectTasks(projectId, companyId);

    return tasks.map(mapTaskToDto);
  }

  async createTask(companyId: number, projectId: number, createTaskDto: CreateTaskDto) {
    await this.ensureProjectExists(projectId, companyId);
    await this.ensureAssigneeInCompany(createTaskDto.assigneeId, companyId);

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

    return mapTaskToDto(task);
  }

  async updateTask(
    companyId: number,
    projectId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const updateData: Parameters<TaskRepository["updateTask"]>[1] = {};

    if (updateTaskDto.name !== undefined) {
      updateData.name = this.getValidName(updateTaskDto.name);
    }

    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description?.trim() ?? "";
    }

    if (updateTaskDto.assigneeId !== undefined) {
      await this.ensureAssigneeInCompany(updateTaskDto.assigneeId, companyId);

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

    return mapTaskToDto(task);
  }

  async updateTaskStatus(
    companyId: number,
    projectId: number,
    taskId: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    await this.ensureTaskExists(taskId, projectId, companyId);

    const task = await this.taskRepository.updateTask(taskId, {
      status: updateTaskStatusDto.status,

      ...(updateTaskStatusDto.position !== undefined
        ? { position: updateTaskStatusDto.position }
        : {}),
    });

    return mapTaskToDto(task);
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

    return tasks.map(mapTaskToDto);
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

  private async ensureAssigneeInCompany(assigneeId: number, companyId: number) {
    const isUserInCompany = await this.taskRepository.isUserInCompany(assigneeId, companyId);

    if (!isUserInCompany) {
      throw new BadRequestException("Task assignee must belong to the company");
    }
  }

  private getValidName(name: string) {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      throw new BadRequestException("Task name must be at least 2 characters long");
    }

    return trimmedName;
  }

  private getValidDate(value: string, label: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${label} is invalid`);
    }

    return date;
  }
}
