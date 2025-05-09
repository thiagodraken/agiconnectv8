
import { Injectable } from '@nestjs/common';
import { ConversasGateway } from './conversas.gateway';

export interface Mensagem {
  de: 'cliente' | 'operador';
  texto: string;
}

interface Conversa {
  id: string;
  mensagens: Mensagem[];
}

@Injectable()
export class ConversasService {
  private conversas: Conversa[] = [];

  constructor(private readonly gateway: ConversasGateway) {}

  async listarMensagens(id: string): Promise<Mensagem[]> {
    return this.conversas.find((c) => c.id === id)?.mensagens || [];
  }

  async enviarMensagem(id: string, texto: string): Promise<{ ok: true }> {
    let conversa = this.conversas.find((c) => c.id === id);
    if (!conversa) {
      conversa = { id, mensagens: [] };
      this.conversas.push(conversa);
    }
    const nova: Mensagem = { de: 'operador', texto };
    conversa.mensagens.push(nova);
    this.gateway.server.to(id).emit('nova-mensagem', nova);
    return { ok: true };
  }
}