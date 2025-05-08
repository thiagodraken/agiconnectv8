import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { Tenant } from '../tenant/tenant.entity';
  import { Operator } from '../operators/operator.entity';
  import { Message } from '../messages/message.entity';
  
  @Entity()
  export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    cliente_nome: string;
  
    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn()
    tenant: Tenant;
  
    @ManyToOne(() => Operator, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn()
    operador: Operator;
  
    @OneToMany(() => Message, (msg) => msg.conversation)
    mensagens: Message[];
  }
  