import { NestFactory } from '@nestjs/core';
import { TaskModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
