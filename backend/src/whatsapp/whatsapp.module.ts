import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { WhatsappConfig } from './whatsapp-config.entity';

import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatGateway } from '../chat/chat.gateway';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([WhatsappConfig]),
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService, ChatGateway],
})
export class WhatsappModule {}
