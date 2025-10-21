import {
  IsAlphanumeric,
  IsBoolean,
  IsByteLength,
  IsDefined,
  IsString,
} from 'class-validator';

export class Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export class TaskParamDTO {
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(7, 7)
  @IsDefined()
  id: string;
}

export class CreateTaskDTO {
  @IsString()
  @IsDefined()
  title: string;
  @IsString()
  @IsDefined()
  description: string;
}

export class UpdateTaskDTO extends CreateTaskDTO {
  @IsBoolean()
  @IsDefined()
  completed: boolean;
}
