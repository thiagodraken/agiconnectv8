// 📁 backend/src/tenant/tenant.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async obterTenant(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');
    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const novo = this.tenantRepository.create(data);
    return this.tenantRepository.save(novo);
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.obterTenant(id);
    Object.assign(tenant, data);
    return this.tenantRepository.save(tenant);
  }

  async delete(id: string): Promise<void> {
    await this.tenantRepository.delete(id);
  }

  async verificarExpiracao(id: string): Promise<void> {
    const tenant = await this.obterTenant(id);
    const agora = new Date();

    if (tenant.expiracao && tenant.expiracao <= agora) {
      tenant.status = 'expirado';
      tenant.motivo_bloqueio = 'Plano expirado';
      await this.tenantRepository.save(tenant);
      throw new ForbiddenException('Tenant expirado. Acesso bloqueado.');
    }
  }

  async verificarLimites(id: string, contexto: 'canais' | 'operadores' | 'disco', valorAtual: number): Promise<void> {
    const tenant = await this.obterTenant(id);

    if (tenant.status === 'bloqueado' || tenant.status === 'expirado') {
      throw new ForbiddenException(`Tenant ${tenant.status}. Acesso bloqueado.`);
    }

    switch (contexto) {
      case 'canais':
        if (valorAtual >= tenant.canais_maximos) {
          throw new ForbiddenException('Limite de canais atingido.');
        }
        break;
      case 'operadores':
        if (valorAtual >= tenant.operadores_maximos) {
          throw new ForbiddenException('Limite de operadores atingido.');
        }
        break;
      case 'disco':
        if (valorAtual >= tenant.espaco_em_disco_mb) {
          throw new ForbiddenException('Limite de espaço em disco atingido.');
        }
        break;
    }
  }

  async bloquearTenant(id: string, motivo: string): Promise<void> {
    const tenant = await this.obterTenant(id);
    tenant.status = 'bloqueado';
    tenant.motivo_bloqueio = motivo;
    await this.tenantRepository.save(tenant);
  }

  async desbloquearTenant(id: string): Promise<void> {
    const tenant = await this.obterTenant(id);
    tenant.status = 'ativo';
    tenant.motivo_bloqueio = null;
    await this.tenantRepository.save(tenant);
  }

  async bloquearExpirados(): Promise<string[]> {
    const agora = new Date();
    const expirados = await this.tenantRepository.find({
      where: {
        expiracao: LessThanOrEqual(agora),
        status: 'ativo',
      },
    });

    for (const tenant of expirados) {
      tenant.status = 'expirado';
      tenant.motivo_bloqueio = 'Plano expirado automaticamente';
      await this.tenantRepository.save(tenant);
    }

    return expirados.map((t) => t.nome_empresa);
  }

  async atualizarStatus(id: string, status: string): Promise<Tenant> {
    const tenant = await this.obterTenant(id);
    if (status === 'bloqueado') {
      tenant.status = 'bloqueado';
      tenant.motivo_bloqueio = 'Bloqueado manualmente';
    } else if (status === 'ativo') {
      tenant.status = 'ativo';
      tenant.motivo_bloqueio = null;
    } else if (status === 'expirado') {
      tenant.status = 'expirado';
      tenant.motivo_bloqueio = 'Marcado como expirado';
    }
    return this.tenantRepository.save(tenant);
  }
}
