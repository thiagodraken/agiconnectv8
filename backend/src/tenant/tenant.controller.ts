import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class TenantController {
  constructor(
    private readonly service: TenantService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() body: any): Promise<Tenant> {
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

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Tenant>) {
    return this.service.update(id, body);
  }

  @Patch(':id/senha')
  alterarSenha(@Param('id') id: string, @Body('novaSenha') novaSenha: string) {
    return this.usersService.alterarSenhaAdminDoTenant(id, novaSenha);
  }

  @Patch(':id/bloquear')
  bloquear(@Param('id') id: string, @Body('motivo') motivo: string) {
    return this.service.bloquear(id, motivo);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
