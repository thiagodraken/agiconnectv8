import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly repo: Repository<Channel>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['tenant'] });
  }

  findByTenant(tenantId: string) {
    return this.repo.find({
      where: { tenant: { id: tenantId } },
      relations: ['tenant'],
    });
  }

  async create(data: any) {
    const count = await this.repo.count({
      where: { tenant: { id: data.tenant.id } },
    });

    const limite = data.tenant.canais_maximos;

    if (count >= limite) {
      throw new BadRequestException('Limite de canais atingido para este cliente.');
    }

    const channel = this.repo.create(data);
    return this.repo.save(channel);
  }

  update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
