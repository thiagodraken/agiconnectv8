import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { UsersModule } from '../users/users.module'; // ✅ Importação necessária

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    UsersModule, // ✅ Permite usar UsersService no controller
  ],
  providers: [TenantService],
  controllers: [TenantController],
})
export class TenantModule {}
