import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
  Headers,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SkipAuth } from './skip-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @SkipAuth()
  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Headers('x-register-token') token: string
  ) {
    const validToken = process.env.REGISTER_TOKEN;

    if (token !== validToken) {
      throw new ForbiddenException('Token de registro inválido');
    }

    try {
      await this.usersService.create(body.email, body.password);
      return { message: 'Usuário criado com sucesso' };
    } catch (err) {
      throw new BadRequestException(err.message || 'Erro ao criar usuário');
    }
  }

  @SkipAuth()
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('alterar-senha')
  async alterarSenha(
    @Req() req: any,
    @Body('novaSenha') novaSenha: string
  ) {
    return this.usersService.alterarSenhaPorId(req.user.userId, novaSenha);
  }
}
