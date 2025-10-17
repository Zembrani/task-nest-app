import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/services/task.service';
import { TaskFactory } from './domain/TaskFactory';
import { InMemoryTaskRepository } from './infrastructure/repositories/InMemoryTaskRepository';

@Module({
  controllers: [TaskController],
  providers: [
    TaskFactory,
    {
      provide: 'ITaskService',
      useClass: TaskService,
    },
    TaskService,
    {
      provide: 'ITaskRepository',
      useClass: InMemoryTaskRepository,
    },
    InMemoryTaskRepository,
  ],
})
export class TaskModule {}
