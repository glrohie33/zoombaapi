import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformModel } from './entities/platform.entity';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MongooseModule.forFeature([PlatformModel]), MediaModule],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
