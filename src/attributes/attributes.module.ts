import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {AttributeModel} from "./entities/attribute.entity";

@Module({
  imports:[MongooseModule.forFeature([AttributeModel])],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports:[MongooseModule]
})
export class AttributesModule {}
