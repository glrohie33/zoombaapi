import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {StoreModel} from "./entities/store.entity";

@Module({
  imports:[MongooseModule.forFeature([StoreModel])],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule {}
