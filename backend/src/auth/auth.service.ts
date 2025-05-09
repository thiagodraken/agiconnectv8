import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

async validateUser(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  console.log('Usuário encontrado:', user);

  if (user && await this.usersService.validatePassword(password, user.password)) {
    const { password, ...result } = user;
    return result;
  }

  return null;
}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: any = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    if (user.tenant?.id) {
      payload.tenantId = user.tenant.id;
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
