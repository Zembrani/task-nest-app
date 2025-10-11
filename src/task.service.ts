import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  getAll(): string {
    return 'Todas as tasks.';
  }

  getTaskById(id: string): any {
    return `uma task pelo id ${id}.`;
  }

  createTask(task: any): any {
    return `Task criada com ${task.title}, ${task.description}`;
  }

  updateTask(id: string, task: any): any {
    return `Task atualizada com ${id}, ${task.title}, ${task.description}`;
  }

  deleteTask(id: string): void {}
}
