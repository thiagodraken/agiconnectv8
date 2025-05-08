import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsappConfig } from './whatsapp-config.entity';
import { firstValueFrom } from 'rxjs';
import { Tenant } from '../tenant/tenant.entity';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(WhatsappConfig)
    private readonly configRepo: Repository<WhatsappConfig>,
  ) {}

  async enviarMensagem(accessToken: string, phoneNumberId: string, numeroDestino: string, mensagem: string) {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: numeroDestino,
      type: 'text',
      text: {
        body: mensagem,
      },
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.http.post<{ messages: any[] }>(url, payload, { headers })
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem para WhatsApp:', error.response?.data || error.message);
      throw error;
    }
  }

  async salvarOuAtualizarConfig(data: { tenant: Tenant; accessToken: string; phoneNumberId: string }) {
    const existente = await this.configRepo.findOne({
      where: { tenant: { id: data.tenant.id } },
      relations: ['tenant'],
    });

    if (existente) {
      existente.accessToken = data.accessToken;
      existente.phoneNumberId = data.phoneNumberId;
      return this.configRepo.save(existente);
    }

    return this.configRepo.save(this.configRepo.create(data));
  }

  async buscarConfigPorTenant(tenantId: string) {
    return this.configRepo.findOne({
      where: { tenant: { id: tenantId } },
      relations: ['tenant'],
    });
  }

  async buscarTenantPorPhoneId(phoneNumberId: string) {
    const config = await this.configRepo.findOne({
      where: { phoneNumberId },
      relations: ['tenant'],
    });

    return config?.tenant || null;
  }
}
