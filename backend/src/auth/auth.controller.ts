import {
  Controller,
  Post,
  Body,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Headers('x-register-token') token: string
  ) {
    const validToken = process.env.REGISTER_TOKEN;

    if (token !== validToken) {
      throw new ForbiddenException('Token de registro inválido');
    }

    await this.usersService.create(body.email, body.password);
    return { message: 'Usuário criado com sucesso' };
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
