import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TaskEvents } from '../../domain/events/event.constants';
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from '../../domain/events/task-event/task-event';

@Injectable()
export class RabbitmqSubscriber {
  @RabbitSubscribe({
    exchange: 'task_exchange',
    routingKey: TaskEvents.CREATED,
    queue: 'task_created_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async handleTaskCreatedSub(payload: TaskCreatedEvent) {
    try {
      const { id, timestamp, actor, data } = payload;

      console.log(
        `Event Task created - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      console.error('Error processing handleTaskCreatedSub:', error);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: 'task_exchange',
    routingKey: TaskEvents.UPDATED,
    queue: 'task_updated_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async handleTaskUpdatedSub(payload: TaskUpdatedEvent) {
    try {
      const { id, timestamp, actor, data } = payload;

      console.log(
        `Event Task updated - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      console.error('Error processing handleTaskUpdatedSub:', error);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: 'task_exchange',
    routingKey: TaskEvents.DELETED,
    queue: 'task_deleted_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async handleTaskDeletedSub(payload: TaskDeletedEvent) {
    try {
      const { id, timestamp, actor, data } = payload;

      console.log(
        `Event Task deleted - id: ${id}, timestamp: ${timestamp}, user: ${actor.userId}, data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      console.error('Error processing handleTaskDeletedSub:', error);
      return new Nack(false);
    }
  }
}
