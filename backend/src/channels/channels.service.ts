import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepo: Repository<Channel>,
  ) {}

  findAll() {
    return this.channelRepo.find({ relations: ['tenant'] });
  }

  findByTenant(tenantId: string) {
    return this.channelRepo.find({
      where: { tenant: { id: tenantId } },
      relations: ['tenant'],
    });
  }

  create(data: any) {
    const channel = this.channelRepo.create(data);
    return this.channelRepo.save(channel);
  }

  update(id: string, data: any) {
    return this.channelRepo.update(id, data);
  }

  delete(id: string) {
    return this.channelRepo.delete(id);
  }
}
