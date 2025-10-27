import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from '../../domain/events/task-event/task-event';
import { Task } from '../../domain/TaskDomain';

@Injectable()
export class TaskCreatedListener {
  @OnEvent('task.created')
  handleTaskCreatedEvent(payload: Task) {
    const { id, timestamp, actor, data } = new TaskCreatedEvent(payload);

    console.log(
      `Event Task created - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
    );
  }

  @OnEvent('task.updated')
  handleTaskUpdatedEvent(before: Task, after: Task) {
    const { id, timestamp, actor, data } = new TaskUpdatedEvent({
      before,
      after,
    });

    console.log(
      `Event Task updated - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
    );
  }

  @OnEvent('task.deleted')
  handleTaskDeletedEvent(payload: { id: string }) {
    const { id, timestamp, actor, data } = new TaskDeletedEvent(payload);

    console.log(
      `Event Task deleted - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
    );
  }
}
