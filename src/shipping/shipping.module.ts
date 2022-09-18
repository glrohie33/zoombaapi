import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import {HttpModule} from "@nestjs/axios";
import {MongooseModule} from "@nestjs/mongoose";
import {ShippingModel} from "./entities/shipping.entity";

@Module({
  imports:[HttpModule,MongooseModule.forFeature([ShippingModel])],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports:[ShippingService]
})
export class ShippingModule {}
