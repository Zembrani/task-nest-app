import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqSubscriber } from './rabbitmq.subscriber';

@Module({
  imports: [
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
  controllers: [NotificationController],
  providers: [NotificationService, RabbitmqSubscriber],
})
export class NotificationModule {}
