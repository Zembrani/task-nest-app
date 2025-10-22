import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/services/task.service';
import { TaskFactory } from './domain/TaskFactory';
import { InMemoryTaskRepository } from './infrastructure/repositories/InMemoryTaskRepository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskCreatedListener } from './application/listeners/TaskCreated.listener';

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
    TaskCreatedListener,
  ],
  imports: [EventEmitterModule.forRoot()],
})
export class TaskModule {}
