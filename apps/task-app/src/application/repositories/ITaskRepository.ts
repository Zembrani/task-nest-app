import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | undefined>;
  create(taskData: Partial<Task>): Promise<Task>;
  update(task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
}
