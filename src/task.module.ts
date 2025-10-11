import { Module } from '@nestjs/common';
import { TaskController } from './presentation/task.controller';
import { TaskService } from './application/task.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
