import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectStatus } from "@syncr/packages";

import { LabelsRepository } from "../../repositories/labels.repository";
import { ProjectsRepository } from "../../repositories/projects.repository";
import { AddProjectMemberDto, CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import { mapProjectToDto } from "./projects.mapper";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly labelsRepository: LabelsRepository,
  ) {}

  async getCompanyProjects(companyId: number) {
    const projects = await this.projectRepository.getCompanyProjects(companyId);

    return projects.map(mapProjectToDto);
  }

  async getCompanyProject(companyId: number, projectId: number) {
    const project = await this.projectRepository.getCompanyProject(companyId, projectId);

    return mapProjectToDto(project);
  }

  async getProjectManagerCandidates(companyId: number) {
    return await this.projectRepository.getProjectManagerCandidates(companyId);
  }

  async getProjectAssignees(companyId: number, projectId: number) {
    await this.ensureProjectExists(companyId, projectId);

    return await this.projectRepository.getProjectAssignees(companyId, projectId);
  }

  async getProjectLabels(companyId: number, projectId: number) {
    await this.ensureProjectExists(companyId, projectId);

    const labels = await this.labelsRepository.getProjectLabels(projectId, companyId);

    if (labels.length === 0) {
      return await this.labelsRepository.createDefaultProjectLabels(projectId);
    }

    return labels;
  }

  async getProjectMemberCandidates(companyId: number, projectId: number) {
    await this.ensureProjectExists(companyId, projectId);

    return await this.projectRepository.getProjectMemberCandidates(companyId);
  }

  async addProjectMember(
    companyId: number,
    projectId: number,
    addProjectMemberDto: AddProjectMemberDto,
  ) {
    await this.ensureProjectExists(companyId, projectId);
    await this.ensureUserInCompany(companyId, addProjectMemberDto.userId);

    const isAlreadyMember = await this.projectRepository.isUserAssignedToProject(
      companyId,
      projectId,
      addProjectMemberDto.userId,
    );

    if (!isAlreadyMember) {
      await this.projectRepository.addProjectMember(projectId, addProjectMemberDto.userId);
    }

    return await this.projectRepository.getProjectAssignees(companyId, projectId);
  }

  async removeProjectMember(companyId: number, projectId: number, userId: number) {
    await this.ensureProjectExists(companyId, projectId);

    const removedMember = await this.projectRepository.removeProjectMember(
      companyId,
      projectId,
      userId,
    );

    if (!removedMember) {
      throw new NotFoundException("Project member not found");
    }

    return await this.projectRepository.getProjectAssignees(companyId, projectId);
  }

  async createProject(companyId: number, createProjectDto: CreateProjectDto) {
    const name = this.getValidName(createProjectDto.name);
    const managerId = await this.getValidManagerId(companyId, createProjectDto.managerId ?? null);

    const project = await this.projectRepository.createProject({
      name,
      companyId,
      managerId,
      description: createProjectDto.description?.trim() ?? "",
      status: ProjectStatus.Active,
      startDate: this.getValidDate(createProjectDto.startDate, "Start date"),
      endDate: createProjectDto.endDate
        ? this.getValidDate(createProjectDto.endDate, "End date")
        : null,
    });

    return mapProjectToDto(project);
  }

  async updateProject(companyId: number, projectId: number, updateProjectDto: UpdateProjectDto) {
    const updateData: Parameters<ProjectsRepository["updateProject"]>[2] = {};

    if (updateProjectDto.name !== undefined) {
      updateData.name = this.getValidName(updateProjectDto.name);
    }

    if (updateProjectDto.description !== undefined) {
      updateData.description = updateProjectDto.description?.trim() ?? "";
    }

    if (updateProjectDto.managerId !== undefined) {
      updateData.managerId = await this.getValidManagerId(companyId, updateProjectDto.managerId);
    }

    if (updateProjectDto.startDate !== undefined) {
      updateData.startDate = this.getValidDate(updateProjectDto.startDate, "Start date");
    }

    if (updateProjectDto.status !== undefined) {
      updateData.status = updateProjectDto.status;
    }

    if (updateProjectDto.endDate !== undefined) {
      updateData.endDate = updateProjectDto.endDate
        ? this.getValidDate(updateProjectDto.endDate, "End date")
        : null;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No project fields to update");
    }

    const project = await this.projectRepository.updateProject(projectId, companyId, updateData);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return mapProjectToDto(project);
  }

  private getValidName(name: string) {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      throw new BadRequestException("Project name must be at least 2 characters long");
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

  private async getValidManagerId(companyId: number, managerId: number | null | undefined) {
    if (managerId == null) {
      return null;
    }

    const isCandidate = await this.projectRepository.isProjectManagerCandidate(
      companyId,
      managerId,
    );

    if (!isCandidate) {
      throw new BadRequestException("Project manager must be a company owner or project manager");
    }

    return managerId;
  }

  private async ensureProjectExists(companyId: number, projectId: number) {
    const project = await this.projectRepository.getCompanyProject(companyId, projectId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }
  }

  private async ensureUserInCompany(companyId: number, userId: number) {
    const isUserInCompany = await this.projectRepository.isUserInCompany(companyId, userId);

    if (!isUserInCompany) {
      throw new BadRequestException("Project member must belong to the company");
    }
  }
}
