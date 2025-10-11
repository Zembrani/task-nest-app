import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../domain/TaskDomain';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(): string {
    return this.taskService.getAll();
  }

  @Get(':id')
  getTaskById(@Param('id') id: TaskDTO['id']): any {
    if (!id || typeof id !== 'string' || id.length !== 7) {
      throw new Error('ID parameter must be a valid identifier.');
    }

    const task = this.taskService.getTaskById(id);

    if (!task) {
      throw new Error('Task not found.');
    }

    return task;
  }

  @Post()
  createTask(@Body() body: CreateTaskDTO): any {
    const { title, description } = body;

    if (!title) {
      throw new Error('Title is a required field.');
    }

    const task = this.taskService.createTask({
      title,
      description,
    });

    return task;
  }

  @Put(':id')
  updateTask(@Param('id') id: TaskDTO['id'], @Body() taskDTO: UpdateTaskDTO): string {
    const { title, description, completed } = taskDTO;

    if (!id || typeof id !== 'string' || id.length !== 7) {
      throw new Error('ID parameter must be a valid identifier.');
    }
    if (
      typeof title === 'undefined' &&
      typeof description === 'undefined' &&
      typeof completed === 'undefined'
    ) {
      throw new Error(
        'Request body must contain at least one field to update.',
      );
    }

    const task = { title, description, completed };
    const taskReturn = this.taskService.updateTask(id, task);

    if (!taskReturn) {
      throw new Error('Task not found.');
    }

    return taskReturn;
  }

  @Delete(':id')
  deleteTask(@Param('id') id: TaskDTO['id']): string {
    if (!id || typeof id !== 'string' || id.length !== 7) {
      throw new Error('ID parameter must be a valid identifier.');
    }

    this.taskService.deleteTask(id);

    return `Removeu o id ${id}`;
  }
}
