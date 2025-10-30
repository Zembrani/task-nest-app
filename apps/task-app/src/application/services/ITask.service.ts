import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';

export interface ITaskService {
  getAll(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(data: Partial<Task>): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
