import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';
import { ITaskService } from './ITask.service';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TaskEvents } from '../../../../../libs/shared/src/domain/events/event.constants';
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from '../../../../../libs/shared/src/domain/events/task-event/task-event';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject('ITaskRepository') private taskRepository: ITaskRepository,
    private readonly amqpConnection: AmqpConnection,
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

    try {
      const payload = new TaskCreatedEvent(createdTask);

      this.amqpConnection.publish(
        'task_exchange',
        TaskEvents.CREATED,
        payload,
        { persistent: true },
      );
    } catch (error) {
      console.error(`[Service] Error publishing ${TaskEvents.CREATED}:`, error);
    }

    return createdTask;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (!existingTask) {
      return null;
    }

    const updatedTask = await this.taskRepository.update(id, task);

    try {
      if (!updatedTask) {
        throw new Error('Updated task is null');
      }

      const payload = new TaskUpdatedEvent({
        before: existingTask,
        after: updatedTask,
      });
      this.amqpConnection.publish(
        'task_exchange',
        TaskEvents.UPDATED,
        payload,
        { persistent: true },
      );
    } catch (error) {
      console.error(`[Service] Error publishing ${TaskEvents.UPDATED}:`, error);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const existingTask = await this.taskRepository.getTaskById(id);

    if (existingTask) {
      await this.taskRepository.delete(id);
    }

    try {
      const payload = new TaskDeletedEvent({ id });
      this.amqpConnection.publish(
        'task_exchange',
        TaskEvents.DELETED,
        payload,
        { persistent: true },
      );
    } catch (error) {
      console.error(`[Service] Error publishing ${TaskEvents.DELETED}:`, error);
    }
  }
}
