import {
  CreateTaskBody,
  ReorderTaskItem,
  ReorderTasksBody,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskBody,
  UpdateTaskStatusBody,
} from "@syncr/packages";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class TaskDto implements Task {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  projectId: number;

  @IsInt()
  assigneeId: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsInt()
  position: number;

  @IsDateString()
  @IsOptional()
  endDate: string | null;
}

export class CreateTaskDto implements CreateTaskBody {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsInt()
  assigneeId: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;
}

export class UpdateTaskDto implements UpdateTaskBody {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;
}

export class UpdateTaskStatusDto implements UpdateTaskStatusBody {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}

export class ReorderTaskItemDto implements ReorderTaskItem {
  @IsInt()
  id: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  @Min(0)
  position: number;
}

export class ReorderTasksDto implements ReorderTasksBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTaskItemDto)
  tasks: ReorderTaskItemDto[];
}
