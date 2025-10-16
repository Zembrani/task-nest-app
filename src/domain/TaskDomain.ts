import {
  OmitType,
} from '@nestjs/mapped-types';
import { IsAlphanumeric, IsBoolean, IsByteLength, IsString } from 'class-validator';

export class Task {
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(7, 7)
  id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsBoolean()
  completed: boolean
}

export class CreateTaskDTO extends OmitType(Task, ['id', 'completed'] as const) {}
export class UpdateTaskDTO extends OmitType(Task, ['id'] as const) {}
