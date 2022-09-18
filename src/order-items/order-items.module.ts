import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemModel } from './entities/order-item.entity';

@Module({
  imports:[MongooseModule.forFeature([OrderItemModel])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports:[MongooseModule,OrderItemsService]
})
export class OrderItemsModule {}
