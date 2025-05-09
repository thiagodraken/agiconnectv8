// 📁 backend/src/conversas/conversas.module.ts
import { Module } from '@nestjs/common';
import { ConversasController } from './conversas.controller';
import { ConversasService } from './conversas.service';
import { ConversasGateway } from './conversas.gateway';

@Module({
  controllers: [ConversasController],
  providers: [ConversasService, ConversasGateway],
})
export class ConversasModule {}
