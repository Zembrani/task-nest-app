import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqSubscriber {
  @RabbitSubscribe({
    exchange: 'task_queue',
    routingKey: 'rpc-route',
    queue: 'rpc-queue',
  })
  public async pubSubHandler(msg: {}) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}