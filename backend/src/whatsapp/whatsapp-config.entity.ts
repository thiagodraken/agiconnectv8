import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

@Entity()
export class WhatsappConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn()
  tenant: Tenant;

  @Column()
  accessToken: string;

  @Column()
  phoneNumberId: string;
}
