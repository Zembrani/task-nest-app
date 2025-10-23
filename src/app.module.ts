import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/services/task.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskCreatedListener } from './application/listeners/TaskCreated.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './infrastructure/database/task.entity';
import { PostgresTaskRepository } from './infrastructure/repositories/PostgresTaskRepository';

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: 'ITaskService',
      useClass: TaskService,
    },
    TaskService,
    {
      provide: 'ITaskRepository',
      useClass: PostgresTaskRepository,
    },
    PostgresTaskRepository,
    TaskCreatedListener,
  ],
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tasknest',
      database: 'tasks',
      synchronize: true,
      entities: [TaskEntity],
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
})
export class TaskModule {}
