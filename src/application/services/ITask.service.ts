import { CreateTaskDTO, Task, UpdateTaskDTO } from "src/domain/TaskDomain";

export interface ITaskService {
  getAll(): Promise<Task[]>;
  getTaskById(id: Task['id']): Promise<Task | null>;
  createTask(data: CreateTaskDTO): Promise<Task>;
  updateTask(id: Task['id'], task: UpdateTaskDTO): Promise<Task | null>;
  deleteTask(id: Task['id']): Promise<void>
}