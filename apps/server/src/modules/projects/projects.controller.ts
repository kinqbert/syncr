import {
  Body,
  Controller,
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
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { RequirePermission } from "src/common/decorators/require-permission.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionGuard } from "src/common/guards/permission-guard.guard";

import {
  CreateProjectDto,
  ProjectDto,
  ProjectManagerCandidateDto,
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

  @Post()
  @RequirePermission(PermissionKey.ProjectCreate)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @CompanyId() companyId: number,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.createProject(companyId, createProjectDto);
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
