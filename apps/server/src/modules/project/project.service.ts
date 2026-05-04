import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectStatus } from "@syncr/packages";
import { ProjectRepository } from "src/repositories/project.repository";

import { CreateProjectDto, UpdateProjectDto } from "./project.dto";
import { mapProjectToDto } from "./project.mapper";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getCompanyProjects(companyId: number) {
    const projects = await this.projectRepository.getCompanyProjects(companyId);

    return projects.map(mapProjectToDto);
  }

  async getProjectManagerCandidates(companyId: number) {
    return await this.projectRepository.getProjectManagerCandidates(companyId);
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
    const updateData: Parameters<ProjectRepository["updateProject"]>[2] = {};

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
}
