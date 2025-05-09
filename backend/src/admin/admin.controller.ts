import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('dashboard')
  getDashboard(@Req() req: any) {
    const user = req.user;

    return {
      message: 'Painel do cliente carregado com sucesso.',
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
