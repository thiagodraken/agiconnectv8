import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Conversation } from '../conversations/conversation.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    autor: 'cliente' | 'operador';
  
    @Column()
    texto: string;
  
    @CreateDateColumn()
    enviada_em: Date;
  
    @ManyToOne(() => Conversation, (conv) => conv.mensagens, { onDelete: 'CASCADE' })
    @JoinColumn()
    conversation: Conversation;
  }
  