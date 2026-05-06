import {
  AddProjectMemberBody,
  CreateProjectBody,
  Project,
  ProjectAssignee,
  ProjectManagerCandidate,
  ProjectMemberCandidate,
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
  status: ProjectStatus;

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
  status?: ProjectStatus;

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

export class ProjectAssigneeDto implements ProjectAssignee {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class ProjectMemberCandidateDto
  extends ProjectAssigneeDto
  implements ProjectMemberCandidate
{
  @IsString()
  roleKey: string;

  @IsString()
  roleName: string;
}

export class AddProjectMemberDto implements AddProjectMemberBody {
  @IsNumber()
  userId: number;
}
