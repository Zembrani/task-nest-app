import { Injectable } from '@nestjs/common';
import type { CreateTaskDTO, UpdateTaskDTO } from '../domain/TaskDomain';

@Injectable()
export class TaskService {
  getAll(): string {
    return 'Todas as tasks.';
  }

  getTaskById(id: string): any {
    return `uma task pelo id ${id}.`;
  }

  createTask(task: CreateTaskDTO): any {
    return `Task criada com ${task.title}, ${task.description}`;
  }

  updateTask(id: string, task: UpdateTaskDTO): any {
    return `Task atualizada com ${id}, ${task.title}, ${task.description}`;
  }

  deleteTask(id: string): void {}
}
