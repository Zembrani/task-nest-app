import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/services/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './infrastructure/database/task.entity';
import { PostgresTaskRepository } from './infrastructure/repositories/PostgresTaskRepository';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

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
    AuthGuard,
    JwtService
  ],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tasknest',
      database: process.env.POSTGRES_DATABASE || 'tasks',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'task_exchange',
          type: 'topic',
          options: { durable: true },
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: true, timeout: 5000 },
    }),
  ],
})
export class TaskModule {}
