import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/services/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './infrastructure/database/task.entity';
import { PostgresTaskRepository } from './infrastructure/repositories/PostgresTaskRepository';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqSubscriber } from './application/queue/RabbitmqSub';

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
    RabbitmqSubscriber
  ],
  imports: [
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
    RabbitMQModule.forRoot({
          exchanges: [
            {
              name: 'task_exchange',
              type: 'topic',
            },
          ],
          uri: 'amqp://guest:guest@localhost:5672',
          connectionInitOptions: { wait: false },
        }),
  ],
})
export class TaskModule {}
