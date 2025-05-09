// 📁 backend/src/users/users.controller.ts
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @SkipAuth()
  @Post('superadmin')
  @HttpCode(201)
  async criarSuperAdmin(
    @Body() body: { email: string; password: string },
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    if (token !== process.env.REGISTER_TOKEN) {
      throw new UnauthorizedException('Token inválido');
    }
    return this.service.create(body.email, body.password);
  }
}
