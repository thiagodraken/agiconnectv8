import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome_empresa: string;

  @Column()
  email_admin: string;

  @Column('int')
  canais_maximos: number;

  @Column('int')
  operadores_maximos: number;

  @Column('int')
  espaco_em_disco_mb: number;

  @Column('timestamp')
  expiracao: Date;

  @Column({ type: 'enum', enum: ['ativo', 'bloqueado', 'expirado'], default: 'ativo' })
  status: 'ativo' | 'bloqueado' | 'expirado';

  @Column({ nullable: true })
  motivo_bloqueio: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
