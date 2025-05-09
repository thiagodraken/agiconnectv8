// 📁 backend/src/whatsapp/whatsapp.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { WhatsappService } from './WhatsappService';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  @Post('enviar')
  enviarMensagemDireta(@Body() body: { numero: string; mensagem: string }) {
    return this.service.enviarTexto(body.numero, body.mensagem);
  }

  @Post('config/:tenantId')
  salvarOuAtualizarConfig(@Param('tenantId') tenantId: string, @Body() data: any) {
    return this.service.salvarOuAtualizarConfig({ tenantId, ...data });
  }

  @Post('buscar-config/:tenantId')
  buscarConfigPorTenant(@Param('tenantId') tenantId: string) {
    return this.service.buscarConfigPorTenant(tenantId);
  }

  @Post('buscar-tenant/:phoneNumberId')
  async buscarTenantPorPhoneId(@Param('phoneNumberId') phoneNumberId: string) {
    const tenant = await this.service.buscarTenantPorPhoneId(phoneNumberId);
    return tenant.tenantId;
  }
}
