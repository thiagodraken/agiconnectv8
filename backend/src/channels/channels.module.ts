import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelService } from './channels.service';
import { ChannelController } from './channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelsModule {}
