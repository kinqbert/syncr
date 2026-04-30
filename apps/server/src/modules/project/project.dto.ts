import {
  CreateProjectBody,
  Project,
  ProjectManagerCandidate,
  ProjectStatus,
  UpdateProjectBody,
} from "@syncr/packages";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class ProjectDto implements Project {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsNumber()
  @IsOptional()
  managerId: number | null;

  @IsNumber()
  companyId: number;

  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string | null;
}

export class CreateProjectDto implements CreateProjectBody {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsNumber()
  @IsOptional()
  managerId?: number | null;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;
}

export class UpdateProjectDto implements UpdateProjectBody {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsNumber()
  @IsOptional()
  managerId?: number | null;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  projectStatus?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;
}

export class ProjectManagerCandidateDto implements ProjectManagerCandidate {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  roleKey: string;

  @IsString()
  roleName: string;
}
