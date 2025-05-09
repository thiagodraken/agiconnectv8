// 📁 backend/src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Tenant } from '../tenant/tenant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('E-mail já registrado');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashed,
      role: 'superadmin',
    });
    return this.userRepo.save(user);
  }

  async createAdmin(data: {
    email: string;
    password: string;
    tenant: Tenant;
    role?: 'admin' | 'operador';
  }) {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) {
      throw new BadRequestException('E-mail já registrado');
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      email: data.email,
      password: hashed,
      role: data.role ?? 'admin',
      tenant: data.tenant,
    });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email }, relations: ['tenant'] });
  }

  async validatePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }

  async alterarSenhaAdminDoTenant(tenantId: string, novaSenha: string) {
    const admin = await this.userRepo.findOne({
      where: { role: 'admin', tenant: { id: tenantId } },
      relations: ['tenant'],
    });
    if (!admin) throw new BadRequestException('Admin não encontrado para este cliente.');
    const hashed = await bcrypt.hash(novaSenha, 10);
    admin.password = hashed;
    return this.userRepo.save(admin);
  }

  async alterarSenhaPorId(userId: string, novaSenha: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuário não encontrado');
    const hashed = await bcrypt.hash(novaSenha, 10);
    user.password = hashed;
    return this.userRepo.save(user);
  }
}
