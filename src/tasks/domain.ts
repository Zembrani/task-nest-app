export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  completed: boolean
}

export interface CreateTaskDTO extends Omit<TaskDTO, 'id' | 'completed'> {}

export interface UpdateTaskDTO extends Omit<TaskDTO, 'id'>{}