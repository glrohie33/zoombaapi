import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {MediaModel} from "./entities/media.entity";

@Module({
  imports:[MongooseModule.forFeature([MediaModel])],
  controllers: [MediaController],
  providers: [MediaService],
  exports:[MongooseModule,MediaService]
})
export class MediaModule {}
