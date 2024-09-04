import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { PaymentsModule } from './payments.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('payments'));
  app.useLogger(app.get(Logger));
  // await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
