import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { CartDto } from '../cart/dto/cart-dto';
import { GatewayFactory } from './gatewayFactory';
import { ShippingService } from '../shipping/shipping.service';
import { CreateShippingDto } from '../shipping/dto/create-shipping.dto';
import { MetaService } from '../meta/meta.service';
import { MetaDocument } from '../meta/entities/meta.entity';
import { OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { v5 as uuidv5 } from 'uuid';
import * as mongoose from 'mongoose';
import { Request } from '../utils/config';
import { REQUEST } from '@nestjs/core';
import { VerifyOrderDto } from './dto/verfy-order.dto';
import { VerifyDto } from 'src/stores/dto/verify-dto';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { ProductDocument } from 'src/products/entities/product.entity';
import { OrderParamsDto } from '../order-items/dto/order-params.dto';
import { OrderFactory } from './platformOrders/orderFactory';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private cartService: CartService,
    private gatewayFactory: GatewayFactory,
    private orderItemsService: OrderItemsService,
    private orderFactory: OrderFactory,
    @InjectModel('orders') private orderModel: Model<OrderDocument>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderDto> {
    const { platform } = this.req.headers;
    await this.orderFactory.getInstance(platform).createOrder(createOrderDto);
    return createOrderDto;
  }

  async findAll(params: OrderParamsDto) {
    const { currentPage, perPage, search } = params;
    const orderQuery = this.orderModel.find({}).regex('title', search);

    const total = await orderQuery.clone().count();

    const orders = await orderQuery
      .clone()
      .limit(perPage)
      .skip((currentPage - 1) * perPage)
      .populate('platformId', ['name'])
      .populate('user', ['email'])
      .sort({ createdAt: -1 });
    params.orders = orders;
    params.total = total;
    return params;
  }

  findOne(id: string) {
    return this.orderModel.findById(id).populate('user');
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async verifyOrder(verifyOrderDto: VerifyOrderDto) {
    const order = await this.findOne(verifyOrderDto.orderId).populate(
      'platformId',
    );
    if (!order) {
      verifyOrderDto.message = [
        'order does not exist and could not be verified',
      ];
    } else {
      const { platform } = this.req.headers;
      await this.orderFactory.getInstance(platform).verifyOrder(verifyOrderDto);
    }
    return verifyOrderDto;
  }
}
