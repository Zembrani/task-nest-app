export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean
}

export interface CreateTaskDTO extends Omit<Task, 'id' | 'completed'> {}

export interface UpdateTaskDTO extends Omit<Task, 'id'>{}