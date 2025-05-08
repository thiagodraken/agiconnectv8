import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['tenant', 'operador', 'mensagens'] });
  }

  findByTenant(tenantId: string) {
    return this.repo.find({
      where: { tenant: { id: tenantId } },
      relations: ['mensagens', 'operador'],
      order: { id: 'DESC' },
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['mensagens', 'tenant', 'operador'],
    });
  }

  create(data: any): Promise<Conversation> {
    const conv = this.repo.create(data as Partial<Conversation>);
    return this.repo.save(conv as Conversation);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  buscarPorClienteETenant(clienteNome: string, tenantId: string) {
    return this.repo.findOne({
      where: {
        cliente_nome: clienteNome,
        tenant: { id: tenantId },
      },
      relations: ['tenant'],
    });
  }

  atribuirOperador(conversationId: string, operadorId: string) {
    return this.repo.update(conversationId, {
      operador: { id: operadorId },
    });
  }
}
