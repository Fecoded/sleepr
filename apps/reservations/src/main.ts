import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ReservationsModule } from './reservations.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('reservations'));
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
