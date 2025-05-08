import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
  ) {}

  // Criar cliente
  async create(data: Partial<Tenant>) {
    const tenant = this.tenantRepo.create(data);
    return this.tenantRepo.save(tenant);
  }

  // Listar todos
  async findAll() {
    return this.tenantRepo.find();
  }

  // Atualizar cliente
  async update(id: string, data: Partial<Tenant>) {
    await this.tenantRepo.update(id, data);
    return this.tenantRepo.findOne({ where: { id } });
  }

  // Bloquear manualmente
  async bloquear(id: string, motivo: string) {
    return this.tenantRepo.update(id, {
      status: 'bloqueado',
      motivo_bloqueio: motivo,
    });
  }

  // Excluir cliente
  async delete(id: string) {
    return this.tenantRepo.delete(id);
  }

  // Verificar e bloquear clientes expirados
  async bloquearExpirados() {
    const agora = new Date();
    const expirados = await this.tenantRepo.find({
      where: {
        status: 'ativo',
        expiracao: LessThan(agora),
      },
    });

    for (const tenant of expirados) {
      tenant.status = 'expirado';
      tenant.motivo_bloqueio = 'Plano expirado. Entre em contato para renovar.';
      await this.tenantRepo.save(tenant);
    }

    return expirados.length;
  }
}
