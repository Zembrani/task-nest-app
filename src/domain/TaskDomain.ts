import { OmitType } from '@nestjs/mapped-types';
import {
  IsAlphanumeric,
  IsBoolean,
  IsByteLength,
  IsDefined,
  IsString,
} from 'class-validator';

export class Task {
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(7, 7)
  @IsDefined()
  id: string;
  @IsString()
  @IsDefined()
  title: string;
  @IsString()
  @IsDefined()
  description: string;
  @IsBoolean()
  @IsDefined()
  completed: boolean;
}

export class TaskParamDTO {
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(7, 7)
  @IsDefined()
  id: string;
}

export class CreateTaskDTO extends OmitType(Task, [
  'id',
  'completed',
] as const) {}
export class UpdateTaskDTO extends OmitType(Task, ['id'] as const) {}
