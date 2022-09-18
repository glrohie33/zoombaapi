import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MetaModel } from './entities/meta.entity';

@Module({
  imports: [MongooseModule.forFeature([MetaModel])],
  controllers: [MetaController],
  providers: [MetaService],
  exports:[MetaService]
})
export class MetaModule {}
