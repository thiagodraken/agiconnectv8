import { Controller, Post, UseGuards } from '@nestjs/common';
import { WithTokenProtection } from '../auth/token.decorator';
import { TokenGuard } from '../auth/token.guard';

@Controller('setup')
@UseGuards(TokenGuard)
export class SetupController {
  @WithTokenProtection()
  @Post('initial')
  async setupSistema() {
    // Lógica para criar superadmin, configs iniciais, etc.
    return { message: 'Setup concluído com sucesso' };
  }
}
