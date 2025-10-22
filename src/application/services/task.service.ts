import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../../domain/TaskDomain';
import { ITaskService } from './ITask.service';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEventPayload } from 'src/domain/events/TaskCreatedEvent';

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

    const payload = new TaskCreatedEventPayload();
    payload.id = createdTask.id;
    payload.title = createdTask.title;
    payload.description = createdTask.description;
    payload.completed = createdTask.completed;

    this.eventEmitter.emit('task.created', payload);

    return createdTask;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (!existingTask) {
      return null;
    }

    return this.taskRepository.update(id, task);
  }

  async deleteTask(id: string): Promise<void> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (existingTask) {
      await this.taskRepository.delete(id);
    }
  }
}
