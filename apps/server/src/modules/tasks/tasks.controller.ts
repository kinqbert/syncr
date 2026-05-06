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
import { PermissionKey } from "@syncr/packages";

import { CompanyId } from "../../common/decorators/company-id.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission-guard.guard";
import {
  CreateTaskAcceptanceCriterionDto,
  CreateTaskDto,
  ReorderTasksDto,
  SetTaskAssigneeDto,
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
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.createTask(companyId, projectId, createTaskDto);
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
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.updateTask(companyId, projectId, taskId, updateTaskDto);
  }

  @Patch(":taskId/set-assignee")
  @RequirePermission(PermissionKey.TaskAssign)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async setAssignee(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @Body() setTaskAssigneeDto: SetTaskAssigneeDto,
  ): Promise<TaskDto> {
    return await this.taskService.setAssignee(companyId, projectId, taskId, setTaskAssigneeDto);
  }

  @Post(":taskId/acceptance-criteria")
  @RequirePermission(PermissionKey.TaskUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAcceptanceCriterion(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
    @Body() createAcceptanceCriterionDto: CreateTaskAcceptanceCriterionDto,
  ): Promise<TaskDto> {
    return await this.taskService.createAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
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
    @Body() updateAcceptanceCriterionDto: UpdateTaskAcceptanceCriterionDto,
  ): Promise<TaskDto> {
    return await this.taskService.updateAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
      criterionId,
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
  ): Promise<TaskDto> {
    return await this.taskService.deleteAcceptanceCriterion(
      companyId,
      projectId,
      taskId,
      criterionId,
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
