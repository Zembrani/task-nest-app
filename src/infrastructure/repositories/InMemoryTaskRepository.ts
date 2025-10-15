import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../../application/repositories/ITaskRepository';
import { Task } from '../../domain/TaskDomain';
import { TaskFactory } from '../../domain/TaskFactory';

@Injectable()
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  constructor(private taskFactory: TaskFactory) {}

  async getAll(): Promise<Task[]> {
    return this.tasks;
  }

  async create(taskData: Omit<Task, 'id' | 'completed'>): Promise<Task> {
    const newTask = this.taskFactory.create(taskData);

    this.tasks.push(newTask);

    return newTask;
  }

  async getTaskById(id: Task['id']): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  async update(id: Task['id'], newTask: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    const existingTask: Task  | undefined = this.tasks[taskIndex];

    if(!existingTask) {
      return null;
    }

    const updatedTask: Task = {...existingTask, ...newTask};
    this.tasks[taskIndex] = updatedTask;

    return updatedTask;
  }

  async delete(id: Task['id']): Promise<void> {
    const index = this.tasks.findIndex(task => task.id === id);

    if(index !== -1) {
      this.tasks.splice(index,1);
    }
  }
}
