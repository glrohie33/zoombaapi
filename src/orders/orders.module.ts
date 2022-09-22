import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { RaveService } from './rave/rave.service';
import { GatewayFactory } from './gatewayFactory';
import { ShippingModule } from '../shipping/shipping.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModel } from './entities/order.entity';
import { MetaModule } from '../meta/meta.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { OrderFactory } from './platformOrders/orderFactory';
import { ZoombaOrder } from './platformOrders/impl/zoombaOrder';

@Module({
  imports: [
    CartModule,
    ShippingModule,
    MetaModule,
    MongooseModule.forFeature([OrderModel]),
    OrderItemsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, GatewayFactory, OrderFactory, ZoombaOrder],
})
export class OrdersModule {}
