// 📁 backend/src/tenant/tenant.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenants')
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

  @Column({
    type: 'enum',
    enum: ['ativo', 'bloqueado', 'expirado'],
    default: 'ativo',
  })
  status: 'ativo' | 'bloqueado' | 'expirado';

@Column({ type: 'text', nullable: true })
motivo_bloqueio: string | null;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
