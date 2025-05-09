// 📁 backend/src/fila/fila.service.ts
import { Injectable } from '@nestjs/common';

interface Mensagem {
  de: 'cliente' | 'operador';
  texto: string;
}

interface Conversa {
  id: string;
  mensagens: Mensagem[];
}

@Injectable()
export class FilaService {
  private fila = [
    { id: 1, nome: 'Cliente João', mensagem: 'Preciso de ajuda' },
    { id: 2, nome: 'Cliente Ana', mensagem: 'Pedido não chegou' },
  ];

  private conversas: Conversa[] = [];

  async listar() {
    return this.fila;
  }

  async atender(id: number) {
    const cliente = this.fila.find((c) => c.id === id);
    if (!cliente) throw new Error('Cliente não encontrado na fila');
    this.fila = this.fila.filter((c) => c.id !== id);

    const convId = `conv-${id}`;
    this.conversas.push({
      id: convId,
      mensagens: [
        { de: 'cliente', texto: cliente.mensagem },
        { de: 'operador', texto: 'Olá, sou seu atendente!' },
      ],
    });

    return {
      conversaId: convId,
      cliente,
    };
  }

  async listarMensagens(conversaId: string) {
    return this.conversas.find((c) => c.id === conversaId)?.mensagens || [];
  }

  async enviarMensagem(conversaId: string, texto: string) {
    const conversa = this.conversas.find((c) => c.id === conversaId);
    if (!conversa) throw new Error('Conversa não encontrada');
    conversa.mensagens.push({ de: 'operador', texto });
    return { ok: true };
  }
}