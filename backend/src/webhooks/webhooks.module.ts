// 📁 backend/src/webhooks/webhooks.module.ts
import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ConversasGateway } from '../conversas/conversas.gateway';

@Module({
  controllers: [WebhooksController],
  providers: [ConversasGateway],
})
export class WebhooksModule {}