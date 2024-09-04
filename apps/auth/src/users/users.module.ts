// Core
import { Module } from '@nestjs/common';

//
import { UsersController } from './users.controller';
import { UserDocument, UsersSchema } from './models/user.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
// Lib
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
