import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { TokenGuard } from '../auth/token.guard';

@Module({
  controllers: [SetupController],
  providers: [TokenGuard],
})
export class SetupModule {}
