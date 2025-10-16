import { CreateTaskDTO, Task, UpdateTaskDTO } from '../../domain/TaskDomain';

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getTaskById(id: Task['id']): Promise<Task | undefined>;
  create(taskData: CreateTaskDTO): Promise<Task>;
  update(id: Task['id'], task: UpdateTaskDTO): Promise<Task | null>;
  delete(id: Task['id']): Promise<void>;
}