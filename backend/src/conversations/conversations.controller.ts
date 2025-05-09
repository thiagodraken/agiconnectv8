import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles('admin')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('tenant/:tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.service.findByTenant(tenantId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Patch(':id/atribuir')
  atribuir(@Param('id') id: string, @Body('operadorId') operadorId: string) {
    return this.service.atribuirOperador(id, operadorId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
