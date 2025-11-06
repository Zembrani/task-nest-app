import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTaskDTO,
  Task,
  TaskParamDTO,
  UpdateTaskDTO,
} from '../../../../libs/shared/src/domain/TaskDomain';
import type { ITaskService } from '../application/services/ITask.service';
import { AuthGuard } from '@app/shared/guards/auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(@Inject('ITaskService') private taskService: ITaskService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<Task[]> {
    const tasks: Task[] = await this.taskService.getAll();
    return tasks;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTaskById(@Param() param: TaskParamDTO): Promise<Task> {
    const task = await this.taskService.getTaskById(param.id);

    return task;
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTask(@Body() body: CreateTaskDTO): Promise<Task> {
    const { title, description } = body;

    const task = await this.taskService.createTask({
      title,
      description,
    });

    return task;
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Param() param: TaskParamDTO): Promise<string> {
    await this.taskService.deleteTask(param.id);

    return `Task id ${param.id} deleted successfully.`;
  }
}
