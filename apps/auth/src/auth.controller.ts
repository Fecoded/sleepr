import { Controller, Res, Post, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';

//
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { UserDocument } from './users/models/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.status(200).json({ success: true, data: user });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async authenticate(@CurrentUser() user: UserDocument) {
    return user;
  }
}
