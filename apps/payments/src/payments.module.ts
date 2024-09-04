import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { LoggerModule, RmqModule } from '@app/common';

@Module({
  imports: [
    RmqModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
