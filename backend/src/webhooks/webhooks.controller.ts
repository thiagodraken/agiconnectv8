// 📁 backend/src/webhooks/webhooks.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ConversasGateway } from '../conversas/conversas.gateway';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly gateway: ConversasGateway) {}

  @Post('whatsapp')
  @HttpCode(200)
  handleWhatsapp(@Body() body: any) {
    const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (msg?.text?.body) {
      const conversaId = `conv-${msg.from}`;
      this.gateway.server.to(conversaId).emit('nova-mensagem', {
        de: 'cliente',
        texto: msg.text.body,
      });
    }
    return 'ok';
  }
}
