import { ShippingService } from '../../../shipping/shipping.service';
import { MetaService } from '../../../meta/meta.service';
import { Order } from '../order';
import { GatewayFactory } from '../../gatewayFactory';
import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { CartDto } from '../../../cart/dto/cart-dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CartService } from '../../../cart/cart.service';
import { REQUEST } from '@nestjs/core';
import { Request } from '../../../utils/config';
import { Model } from 'mongoose';
import { OrderDocument } from '../../entities/order.entity';

import { OrderItemsService } from '../../../order-items/order-items.service';

@Injectable()
export class ZoombaOrder extends Order {
  protected readonly downPercent: number = 100;
  protected readonly handlingFee: number=0;
  constructor(
    protected shippingService: ShippingService,
    protected metaService: MetaService,
    protected gatewayFactory: GatewayFactory,
    protected cartService: CartService,
    protected orderItemsService: OrderItemsService,
    @Inject(REQUEST) protected req: Request,
    @InjectConnection() protected connection: mongoose.Connection,
    @InjectModel('orders') protected orderModel: Model<OrderDocument>,
  ) {
    super();
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    createOrderDto.user = this.req.user.id;
    await this.insertOrder(createOrderDto);
  }
  async finishOrder(order) {
    await this.verifyOrder(order);
  }

  postOrderAction() {
    return null;
  }

  addRefferalBonus(order: OrderDocument) {
    return null;
  }


}
