import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     hosts: '0.0.0.0',
  //     port: configService.get('TCP_PORT'),
  //   },
  // });
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('auth'));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
