// 📁 backend/src/conversas/conversas.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ConversasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const { conversaId } = client.handshake.query;
    if (conversaId) client.join(conversaId.toString());
  }

  handleDisconnect(client: Socket) {
    // desconectar, se necessário
  }

  @SubscribeMessage('enviar-mensagem')
  handleMessage(@MessageBody() data: { conversaId: string; texto: string }) {
    this.server.to(data.conversaId).emit('nova-mensagem', {
      de: 'operador',
      texto: data.texto,
    });
  }
}