import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { CreateTaskDTO, Task, UpdateTaskDTO } from '../domain/TaskDomain';
import type { ITaskService } from 'src/application/services/ITask.service';

@Controller('tasks')
export class TaskController {
  constructor(@Inject('ITaskService') private taskService: ITaskService) {}

  @Get()
  async getAll(): Promise<any> {
      const tasks: Task[] = await this.taskService.getAll();
      return tasks;
  }

  @Get(':id')
  async getTaskById(@Param('id') id: Task['id']): Promise<any> {
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
  async createTask(@Body() body: CreateTaskDTO): Promise<any> {
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
  async updateTask(@Param('id') id: Task['id'], @Body() taskDTO: UpdateTaskDTO): Promise<any> {
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
  async deleteTask(@Param('id') id: Task['id']): Promise<any> {
    if (!id || typeof id !== 'string' || id.length !== 7) {
      throw new Error('ID parameter must be a valid identifier.');
    }

    this.taskService.deleteTask(id);

    return `Removeu o id ${id}`;
  }
}
