import { Injectable, Inject } from '@nestjs/common';
import type { CreateTaskDTO, Task, UpdateTaskDTO } from '../../domain/TaskDomain';
import { ITaskService } from './ITask.service';
import type { ITaskRepository } from '../repositories/ITaskRepository';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject('ITaskRepository') private taskRepository: ITaskRepository
  ) {}

  async getAll(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async getTaskById(id: Task['id']): Promise<Task | null> {
        const existingTask = await this.taskRepository.getTaskById(id);

        if(!existingTask) {
            return null;
        }
        return existingTask;
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.create(data);
  }

  async updateTask(id: Task['id'], task: Partial<Task>): Promise<Task | null> {
        const existingTask = await this.taskRepository.getTaskById(id);

        if(!existingTask) {
            return null;
        }

        return this.taskRepository.update(id, task);
  }

  async deleteTask(id: Task['id']): Promise<void> {
            const existingTask = await this.taskRepository.getTaskById(id);

        if(existingTask) {
            this.taskRepository.delete(id);
        }
  }
}
