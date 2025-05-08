import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  import { MessagesService } from '../messages/messages.service';
  import { Injectable } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  @Injectable()
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly messagesService: MessagesService) {}
  
    @SubscribeMessage('mensagem')
    async handleMessage(@MessageBody() data: any): Promise<void> {
      const saved = await this.messagesService.create(data);
      this.server.emit('mensagem', saved); // broadcast mensagem salva
    }
  }
  