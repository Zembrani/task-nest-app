import { Task } from 'src/domain/TaskDomain';

export interface ITaskService {
  getAll(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Partial<Task>): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<void>;
}
