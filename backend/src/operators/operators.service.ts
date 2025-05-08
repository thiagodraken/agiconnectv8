import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from './operator.entity';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator)
    private readonly repo: Repository<Operator>,
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

  create(data: any) {
    const op = this.repo.create(data);
    return this.repo.save(op);
  }

  update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
