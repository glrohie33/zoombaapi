import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestModel } from './entities/request.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [MongooseModule.forFeature([RequestModel]), OrdersModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
