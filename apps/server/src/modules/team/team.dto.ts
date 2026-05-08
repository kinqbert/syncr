import { type TeamResponse, type TeamUser, UserStatus } from "@syncr/packages";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsInt, IsString, ValidateNested } from "class-validator";

export class TeamUserDto implements TeamUser {
  @IsInt()
  id: number;

  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  roleName: string;

  @IsInt()
  assignedTasks: number;

  @IsInt()
  completedTasks: number;

  @IsInt()
  workload: number;
}

export class TeamResponseDto implements TeamResponse {
  @IsInt()
  totalMembers: number;

  @IsInt()
  activeProjects: number;

  @IsInt()
  averageWorkload: number;

  @IsInt()
  tasksCompleted: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamUserDto)
  members: TeamUserDto[];
}
