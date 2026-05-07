import {
  CreateTaskAcceptanceCriterionBody,
  CreateTaskBody,
  CreateTaskCommentBody,
  ReorderTaskItem,
  ReorderTasksBody,
  Task,
  TaskAcceptanceCriterion,
  TaskActivity,
  TaskActivityAction,
  TaskActivityActor,
  TaskAssignee,
  TaskLabel,
  TaskPriority,
  TaskStatus,
  UpdateTaskAcceptanceCriterionBody,
  UpdateTaskBody,
} from "@syncr/packages";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDivisibleBy,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

class TaskAssigneeDto implements TaskAssignee {
  @IsInt()
  id: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class TaskAcceptanceCriterionDto implements TaskAcceptanceCriterion {
  @IsInt()
  id: number;

  @IsInt()
  taskId: number;

  @IsString()
  description: string;

  @IsBoolean()
  isDone: boolean;

  @IsInt()
  position: number;
}

class TaskActivityActorDto implements TaskActivityActor {
  @IsInt()
  id: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class TaskActivityDto implements TaskActivity {
  @IsInt()
  id: number;

  @IsInt()
  taskId: number;

  @IsEnum(TaskActivityAction)
  action: TaskActivityAction;

  @ValidateNested()
  @IsOptional()
  @Type(() => TaskActivityActorDto)
  actor: TaskActivityActorDto | null;

  @IsString()
  @IsOptional()
  previousValue: string | null;

  @IsString()
  @IsOptional()
  newValue: string | null;

  @IsDateString()
  createdAt: string;
}

export class TaskLabelDto implements TaskLabel {
  @IsInt()
  id: number;

  @IsInt()
  projectId: number;

  @IsString()
  name: string;
}

export class TaskDto implements Task {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  projectId: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => TaskAssigneeDto)
  assignee: TaskAssigneeDto | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskAcceptanceCriterionDto)
  acceptanceCriteria: TaskAcceptanceCriterionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskLabelDto)
  labels: TaskLabelDto[];

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsInt()
  position: number;

  @IsDateString()
  @IsOptional()
  endDate: string | null;

  @IsInt()
  @IsOptional()
  estimateMinutes: number | null;
}

export class CreateTaskDto implements CreateTaskBody {
  @IsString()
  name: string;

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

  @IsInt()
  @IsDivisibleBy(15)
  @Min(0)
  @IsOptional()
  estimateMinutes?: number | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labelNames?: string[];
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
  assigneeId?: number | null;

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

  @IsInt()
  @IsDivisibleBy(15)
  @Min(0)
  @IsOptional()
  estimateMinutes?: number | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labelNames?: string[];
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

export class CreateTaskCommentDto implements CreateTaskCommentBody {
  @IsString()
  content: string;
}

export class CreateTaskAcceptanceCriterionDto implements CreateTaskAcceptanceCriterionBody {
  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}

export class UpdateTaskAcceptanceCriterionDto implements UpdateTaskAcceptanceCriterionBody {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
