// Core
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

// Lib
import {
  DatabaseModule,
  LoggerModule,
  AUTH_SERVICE,
  RmqModule,
  AuthModule,
  PAYMENTS_SERVICE,
} from '@app/common';

//
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    // RmqModule.register({
    //   name: AUTH_SERVICE,
    // }),
    // RmqModule.register({
    //   name: PAYMENTS_SERVICE,
    // }),
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBIT_MQ_URI')],
            queue: configService.get<string>(`RABBIT_MQ_PAYMENTS_QUEUE`),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBIT_MQ_URI')],
            queue: configService.get<string>(`RABBIT_MQ_AUTH_QUEUE`),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // ClientsModule.registerAsync([
    //   {
    //     name: AUTH_SERVICE,
    //     useFactory: (configService: ConfigService) => ({
    //       transport: Transport.TCP,
    //       options: {
    //         host: configService.get('AUTH_HOST'),
    //         post: configService.get('AUTH_PORT'),
    //       },
    //     }),
    //     inject: [ConfigService],
    //   },
    // ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}

// function getTimeDifference(startTime, endTime) {
//   const difference = endTime - startTime;
//   const differenceInMinutes = difference / 1000 / 60;
//   let hours = Math.floor(differenceInMinutes / 60);
//   if (hours < 0) {
//     hours = 24 + hours;
//   }
//   let minutes = Math.floor(differenceInMinutes % 60);
//   if (minutes < 0) {
//     minutes = 60 + minutes;
//   }
//   const hoursAndMinutes = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
//   return hoursAndMinutes;
// }

// const start = new Date(0, 0, 0, 23, 15);
// const end = new Date(0, 0, 0, 1, 30);
// const difference = getTimeDifference(start, end);
