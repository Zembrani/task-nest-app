import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/TaskDomain';

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getTaskById(id: Task['id']): Promise<Task | undefined>;
  create(taskData: Omit<Task, 'id' | 'completed'>): Promise<Task>;
  update(id: Task['id'], task: Partial<Task>): Promise<Task | null>;
  delete(id: Task['id']): Promise<void>;
}