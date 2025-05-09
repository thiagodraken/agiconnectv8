// 📁 backend/src/tenant/tenant.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  Headers,
  UnauthorizedException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly service: TenantService,
    private readonly usersService: UsersService,
  ) {}

  @SkipAuth()
  @Post()
  @HttpCode(201)
  async create(@Body() body: any, @Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (token !== process.env.REGISTER_TOKEN) {
      throw new UnauthorizedException('Token inválido');
    }

    const tenant = await this.service.create(body);
    console.log('🆕 Tenant criado:', tenant.id);

    if (body.email_admin && body.senhaAdmin) {
      await this.usersService.createAdmin({
        email: body.email_admin,
        password: body.senhaAdmin,
        tenant,
      });
    }

    return tenant;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<any>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Patch(':id/status')
  atualizarStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.atualizarStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Patch(':id/senha')
  alterarSenha(@Param('id') id: string, @Body('novaSenha') novaSenha: string) {
    return this.usersService.alterarSenhaAdminDoTenant(id, novaSenha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
