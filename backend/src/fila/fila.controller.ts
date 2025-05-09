// 📁 backend/src/fila/fila.controller.ts
import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { FilaService } from './fila.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fila')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('operador')
export class FilaController {
  constructor(private readonly filaService: FilaService) {}

  @Get()
  async listar() {
    return this.filaService.listar();
  }

  @Put(':id/atender')
  async atender(@Param('id') id: string) {
    return this.filaService.atender(Number(id));
  }
}
