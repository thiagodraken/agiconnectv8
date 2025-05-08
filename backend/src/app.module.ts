import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { UsersModule } from './users/users.module';
import { OperatorsModule } from './operators/operators.module';
import { ChatModule } from './chat/chat.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TenantModule,
    AuthModule,
    ChannelsModule,
    UsersModule,
    OperatorsModule,
    ChatModule,
    ConversationsModule,
    MessagesModule,
    WhatsappModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
