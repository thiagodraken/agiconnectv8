// 📁 backend/src/whatsapp/WhatsappService.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  private readonly apiUrl: string;
  private readonly phoneId: string;
  private readonly token: string;

  constructor(private config: ConfigService) {
    this.apiUrl = this.config.get<string>('META_API_URL') || 'https://graph.facebook.com/v17.0';
    this.phoneId = this.config.get<string>('META_PHONE_ID') || '';
    this.token = this.config.get<string>('META_TOKEN') || '';
  }

  async enviarTexto(numero: string, mensagem: string) {
    const endpoint = `${this.apiUrl}/${this.phoneId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to: numero,
      type: 'text',
      text: { body: mensagem },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.json();
  }

  async salvarOuAtualizarConfig(data: any) {
    return { ok: true, config: data };
  }

  async buscarConfigPorTenant(tenantId: string) {
    return { tenantId, config: {} };
  }

  async buscarTenantPorPhoneId(phoneNumberId: string) {
    return { tenantId: 'mock-tenant-id', phoneId: phoneNumberId };
  }
}