import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as any; // 👈 força o TypeScript a aceitar .role e .tenantId

    if (user?.role !== 'admin') {
      return true; // Apenas admin é restrito por tenant
    }

    const bodyTenantId = request.body?.tenant?.id;
    const paramTenantId = request.params?.tenantId;
    const userTenantId = user.tenantId;

    const alvoTenantId = bodyTenantId || paramTenantId;

    if (alvoTenantId && userTenantId !== alvoTenantId) {
      throw new ForbiddenException('Acesso negado ao tenant solicitado');
    }

    return true;
  }
}
