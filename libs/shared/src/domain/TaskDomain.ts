import { IsBoolean, IsDefined, IsString, IsUUID } from 'class-validator';

export class Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export class TaskParamDTO {
  @IsUUID()
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
