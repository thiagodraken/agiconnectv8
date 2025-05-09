import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WhatsappService } from './WhatsappService';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { ChatGateway } from '../chat/chat.gateway';
import { Conversation } from '../conversations/conversation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly service: WhatsappService,
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
    private readonly gateway: ChatGateway,
  ) {}

  @Post('enviar')
  async enviar(@Body() body: any) {
    const { accessToken, phoneNumberId, numeroDestino, mensagem } = body;
    return this.service.enviarMensagem(accessToken, phoneNumberId, numeroDestino, mensagem);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('config')
  async salvarConfig(@Body() data: any) {
    return this.service.salvarOuAtualizarConfig(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('config/:tenantId')
  async buscarConfig(@Param('tenantId') tenantId: string) {
    return this.service.buscarConfigPorTenant(tenantId);
  }

  @Get('webhook')
  validarWebhook(@Req() req: any) {
    const VERIFY_TOKEN = 'seu_token_webhook';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    }
    return 'Erro de verificação';
  }

  @Post('webhook')
  async receberWebhook(@Body() body: any) {
    const entry = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!entry) return { status: 'ignored' };

    const numeroCliente = entry.from;
    const texto = entry.text?.body || '';
    const phoneNumberId = body.entry?.[0]?.id;

    const tenant = await this.service.buscarTenantPorPhoneId(phoneNumberId);
    if (!tenant) return { status: 'tenant not found' };

    let conversa: Conversation | null = await this.conversations.buscarPorClienteETenant(
      numeroCliente,
      tenant.id,
    );

    if (!conversa) {
      conversa = await this.conversations.create({
        cliente_nome: numeroCliente,
        tenant,
        operador: null,
      });
    }

    if (!conversa) {
      return { status: 'erro', detalhe: 'Falha ao criar conversa' };
    }

    const mensagem = await this.messages.create({
      texto,
      autor: 'cliente',
      conversation: { id: conversa.id },
    });

    this.gateway.server.emit('mensagem', mensagem);

    return { status: 'ok' };
  }
}
