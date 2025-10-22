import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../../domain/TaskDomain';
import { ITaskService } from './ITask.service';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEvents } from 'src/domain/events/event.constants';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject('ITaskRepository') private taskRepository: ITaskRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (!existingTask) {
      return null;
    }
    return existingTask;
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const createdTask = await this.taskRepository.create(data);

    this.eventEmitter.emit(TaskEvents.CREATED, createdTask);

    return createdTask;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (!existingTask) {
      return null;
    }

    const updatedTask = await this.taskRepository.update(id, task);

    this.eventEmitter.emit(TaskEvents.UPDATED, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const existingTask = await this.taskRepository.getTaskById(id);

    this.eventEmitter.emit(TaskEvents.DELETED, { id });

    if (existingTask) {
      await this.taskRepository.delete(id);
    }
  }
}
