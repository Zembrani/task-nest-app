import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEventPayload } from 'src/domain/events/TaskCreatedEvent';

@Injectable()
export class TaskCreatedListener {
  @OnEvent('task.created')
  handleTaskCreatedEvent(task: TaskCreatedEventPayload) {
    console.log('\n teste = ', task);
  }
}
