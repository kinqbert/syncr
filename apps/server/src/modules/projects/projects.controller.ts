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
import { PermissionKey, Project } from "@syncr/packages";
import { UserId } from "src/common/decorators/user-id.decorator";

import { CompanyId } from "../../common/decorators/company-id.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission-guard.guard";
import {
  AddProjectMemberDto,
  CreateProjectDto,
  ProjectAssigneeDto,
  ProjectDto,
  ProjectLabelDto,
  ProjectManagerCandidateDto,
  ProjectMemberCandidateDto,
  UpdateProjectDto,
} from "./projects.dto";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjects(@CompanyId() companyId: number): Promise<ProjectDto[]> {
    return await this.projectService.getCompanyProjects(companyId);
  }

  @Get("manager-candidates")
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectManagerCandidates(
    @CompanyId() companyId: number,
  ): Promise<ProjectManagerCandidateDto[]> {
    return await this.projectService.getProjectManagerCandidates(companyId);
  }

  @Get(":projectId")
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProject(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
  ): Promise<ProjectDto> {
    return await this.projectService.getCompanyProject(companyId, projectId);
  }

  @Get(":projectId/assignees")
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectAssignees(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
  ): Promise<ProjectAssigneeDto[]> {
    return await this.projectService.getProjectAssignees(companyId, projectId);
  }

  @Get(":projectId/labels")
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectLabels(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
  ): Promise<ProjectLabelDto[]> {
    return await this.projectService.getProjectLabels(companyId, projectId);
  }

  @Get(":projectId/member-candidates")
  @RequirePermission(PermissionKey.ProjectView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectMemberCandidates(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
  ): Promise<ProjectMemberCandidateDto[]> {
    return await this.projectService.getProjectMemberCandidates(companyId, projectId);
  }

  @Post()
  @RequirePermission(PermissionKey.ProjectCreate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @CompanyId() companyId: number,
    @UserId() userId: number,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.createProject(companyId, userId, createProjectDto);
  }

  @Post(":projectId/members")
  @RequirePermission(PermissionKey.ProjectUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async addProjectMember(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @UserId() userId: number,
    @Body() addProjectMemberDto: AddProjectMemberDto,
  ): Promise<ProjectAssigneeDto[]> {
    return await this.projectService.addProjectMember(
      companyId,
      projectId,
      userId,
      addProjectMemberDto,
    );
  }

  @Delete(":projectId/members/:userId")
  @RequirePermission(PermissionKey.ProjectUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async removeProjectMember(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<ProjectAssigneeDto[]> {
    return await this.projectService.removeProjectMember(companyId, projectId, userId);
  }

  @Patch(":projectId")
  @RequirePermission(PermissionKey.ProjectUpdate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @CompanyId() companyId: number,
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.updateProject(companyId, projectId, updateProjectDto);
  }
}
