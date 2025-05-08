import { Controller, Post, Get, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @Post()
  create(@Body() body: Partial<Tenant>) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Tenant>) {
    return this.service.update(id, body);
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
