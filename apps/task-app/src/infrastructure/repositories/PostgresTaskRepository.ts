import { InjectRepository } from '@nestjs/typeorm';
import { ITaskRepository } from '../../application/repositories/ITaskRepository';
import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';
import { TaskEntity } from '../database/task.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();

    return this.mapToDomainEntityArray(tasks);
  }
  async getTaskById(id: string): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne({ where: { id } });

    return task ? this.mapToDomainEntity(task) : undefined;
  }
  async create(taskData: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.save(taskData);

    return this.mapToDomainEntity(task);
  }
  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    const taskIndex = await this.taskRepository.findOne({ where: { id } });

    if (!taskIndex) {
      return null;
    }

    const updatedTask = Object.assign(taskIndex, task);

    const savedTask = await this.taskRepository.save(updatedTask);

    return this.mapToDomainEntity(savedTask);
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  private mapToDomainEntityArray(taskEntity: TaskEntity[]): Task[] {
    return taskEntity.map((entity) => this.mapToDomainEntity(entity)) as any;
  }

  private mapToDomainEntity(taskEntity: TaskEntity): Task {
    const task = new Task();
    task.id = taskEntity.id;
    task.title = taskEntity.title;
    task.description = taskEntity.description;
    task.completed = taskEntity.completed;
    return task;
  }
}
