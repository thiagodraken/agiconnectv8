import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantCron {
  private readonly logger = new Logger(TenantCron.name);

  constructor(private readonly tenantService: TenantService) {}

// @Cron(CronExpression.EVERY_HOUR)
// async handleCron() {
//   const bloqueados = await this.tenantService.bloquearExpirados();
//   this.logger.log(`Clientes expirados bloqueados automaticamente: ${bloqueados}`);
// 

}