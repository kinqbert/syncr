import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PermissionKey, TaskActivity, TaskComment } from "@syncr/packages";
import { UserId } from "src/common/decorators/user-id.decorator";

import { CompanyId } from "../../common/decorators/company-id.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission-guard.guard";
import {
  CreateTaskAcceptanceCriterionDto,
  CreateTaskCommentDto,
  CreateTaskDto,
  ReorderTasksDto,
  TaskDto,
  UpdateTaskAcceptanceCriterionDto,
  UpdateTaskDto,
} from "./tasks.dto";
import { TasksService } from "./tasks.service";

@Controller("projects/:projectId/tasks")
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @RequirePermission(PermissionKey.TaskView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectTasks(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
  ): Promise<TaskDto[]> {
    return await this.taskService.getProjectTasks(companyId, projectId);
  }

  @Post()
  @RequirePermission(PermissionKey.TaskCreate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @UserId() userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.createTask(companyId, projectId, userId, createTaskDto);
  }

  @Patch("reorder")
  @RequirePermission(PermissionKey.TaskUpdateStatus)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async reorderTasks(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body() reorderTasksDto: ReorderTasksDto,
  ): Promise<TaskDto[]> {
    return await this.taskService.reorderTasks(companyId, projectId, reorderTasksDto);
  }

  @Patch(":taskId")
  @RequirePermission(PermissionKey.TaskUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @UserId() userId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.updateTask(companyId, projectId, taskId, userId, updateTaskDto);
  }

  @Get(":taskId/activities")
  @RequirePermission(PermissionKey.TaskView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getTaskActivities(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<TaskActivity[]> {
    return await this.taskService.getTaskActivities(companyId, projectId, taskId);
  }

  @Get(":taskId/comments")
  @RequirePermission(PermissionKey.TaskAssign)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getTaskComments(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<TaskComment[]> {
    return await this.taskService.getTaskComments(companyId, projectId, taskId);
  }

  @Post(":taskId/comments")
  @RequirePermission(PermissionKey.TaskAssign)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async createTaskComment(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @UserId() userId: number,
    @Body() createTaskCommentDto: CreateTaskCommentDto,
  ): Promise<TaskComment> {
    return await this.taskService.createTaskComment(
      companyId,
      projectId,
      taskId,
      userId,
      createTaskCommentDto,
    );
  }

  @Post(":taskId/acceptance-criteria")
  @RequirePermission(PermissionKey.TaskUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAcceptanceCriterion(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @UserId() userId: number,
    @Body() createAcceptanceCriterionDto: CreateTaskAcceptanceCriterionDto,
  ): Promise<TaskDto> {
    return await this.taskService.createAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
      userId,
      createAcceptanceCriterionDto,
    );
  }

  @Patch(":taskId/acceptance-criteria/:criterionId")
  @RequirePermission(PermissionKey.TaskUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async updateAcceptanceCriterion(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("criterionId", ParseIntPipe) criterionId: number,
    @UserId() userId: number,
    @Body() updateAcceptanceCriterionDto: UpdateTaskAcceptanceCriterionDto,
  ): Promise<TaskDto> {
    return await this.taskService.updateAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
      criterionId,
      userId,
      updateAcceptanceCriterionDto,
    );
  }

  @Delete(":taskId/acceptance-criteria/:criterionId")
  @RequirePermission(PermissionKey.TaskUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAcceptanceCriterion(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("criterionId", ParseIntPipe) criterionId: number,
    @UserId() userId: number,
  ): Promise<TaskDto> {
    return await this.taskService.deleteAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
      criterionId,
      userId,
    );
  }

  @Delete(":taskId")
  @RequirePermission(PermissionKey.TaskDelete)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<void> {
    await this.taskService.deleteTask(companyId, projectId, taskId);
  }
}
