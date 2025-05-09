import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_TOKEN_PROTECTED_KEY } from './token.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      IS_TOKEN_PROTECTED_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!isProtected) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-register-token'];
    const valid = process.env.REGISTER_TOKEN;

    if (token !== valid) {
      throw new ForbiddenException('Token de autorização inválido');
    }

    return true;
  }
}
