import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './operator.entity';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  providers: [OperatorsService],
  controllers: [OperatorsController],
})
export class OperatorsModule {}
