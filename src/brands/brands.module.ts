import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandModel } from './entities/brand.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MongooseModule.forFeature([BrandModel]), MediaModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [MongooseModule,BrandsService],
})
export class BrandsModule {}
