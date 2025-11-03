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
import {
  CreateTaskDTO,
  Task,
  TaskParamDTO,
  UpdateTaskDTO,
} from '../../../../libs/shared/src/domain/TaskDomain';
import type { ITaskService } from '../application/services/ITask.service';

@Controller('tasks')
export class TaskController {
  constructor(@Inject('ITaskService') private taskService: ITaskService) {}

  @Get()
  async getAll(): Promise<Task[]> {
    const tasks: Task[] = await this.taskService.getAll();
    return tasks;
  }

  @Get(':id')
  async getTaskById(@Param() param: TaskParamDTO): Promise<Task> {
    const task = await this.taskService.getTaskById(param.id);

    return task;
  }

  @Post()
  async createTask(@Body() body: CreateTaskDTO): Promise<Task> {
    const { title, description } = body;

    const task = await this.taskService.createTask({
      title,
      description,
    });

    return task;
  }

  @Put(':id')
  async updateTask(
    @Param() param: TaskParamDTO,
    @Body() taskDTO: UpdateTaskDTO,
  ): Promise<Task> {
    const { title, description, completed } = taskDTO;

    const task = { title, description, completed };
    const taskReturn = await this.taskService.updateTask(param.id, task);

    return taskReturn;
  }

  @Delete(':id')
  async deleteTask(@Param() param: TaskParamDTO): Promise<string> {
    await this.taskService.deleteTask(param.id);

    return `Task id ${param.id} deleted successfully.`;
  }
}
