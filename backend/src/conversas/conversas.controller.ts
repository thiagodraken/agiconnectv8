// 📁 backend/src/conversas/conversas.controller.ts
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ConversasService } from './conversas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('conversas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('operador')
export class ConversasController {
  constructor(private readonly service: ConversasService) {}

  @Get(':id')
  async listarMensagens(@Param('id') id: string) {
    return this.service.listarMensagens(id);
  }

  @Post(':id')
  async enviar(@Param('id') id: string, @Body('texto') texto: string) {
    return this.service.enviarMensagem(id, texto);
  }
}
