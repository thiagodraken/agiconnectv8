import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['conversation'] });
  }

  findByConversation(conversationId: string) {
    return this.repo.find({
      where: { conversation: { id: conversationId } },
      order: { enviada_em: 'ASC' },
    });
  }

  create(data: any) {
    const msg = this.repo.create(data);
    return this.repo.save(msg);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
