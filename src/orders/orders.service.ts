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
import { FinanceOrderDto } from './dto/finance-order.dto';
import { UserDocument } from '../users/entities/user.entity';

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
    console.log(platform);
    try {
      await this.orderFactory.getInstance(platform).createOrder(createOrderDto);
    } catch (e) {
      console.log(e);
      createOrderDto.message = e.message;
    }

    return createOrderDto;
  }

  async findAll(params: OrderParamsDto) {
    const {
      currentPage,
      perPage,
      search,
      user,
      paymentGateway,
      paymentStatus,
    } = params;
    const filter: any = this.cleanUpObject({ paymentGateway, paymentStatus });
    const { user: authUser } = this.req;
    await this.filterBaseOnUser(filter, authUser);
    const orderQuery = this.orderModel.find(filter).regex('title', search);

    const total = await orderQuery.clone().count();

    const orders = await orderQuery
      .clone()
      .limit(perPage)
      .skip((currentPage - 1) * perPage)
      .populate('user', ['email'])
      .populate('requests')
      .sort({ createdAt: -1 });
    params.orders = orders;
    params.total = total;
    return params;
  }

  cleanUpObject(object: any) {
    const newFilter = {};
    Object.keys(object).forEach((key) => {
      if (object[key]) {
        newFilter[key] = object[key];
      }
    });
    return newFilter;
  }

  async filterBaseOnUser(filter: any, user: UserDocument) {
    switch (user.role) {
      case 'user':
        filter.user = user.id;
        break;
      case 'finance-manager':
        await user.populate('paymentGateway');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filter.paymentGateway = user.paymentGateway[0]?.key || '';
        break;
      default:
        return true;
        break;
    }
  }

  findOne(id: string) {
    return this.orderModel.findById(id).populate('user').populate('requests');
  }

  update(id, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async verifyOrder(verifyOrderDto: VerifyOrderDto) {
    const order: OrderDocument = await this.findOne(verifyOrderDto.orderId);
    if (!order) {
      verifyOrderDto.message = [
        'order does not exist and could not be verified',
      ];
    } else {
      const { platform } = order;
      verifyOrderDto.order = order
      console.log('verifying');
      try {
        await this.orderFactory
          .getInstance(platform)
          .finishOrder(verifyOrderDto);
      } catch (e) {
        console.log(e.message);
        verifyOrderDto.message = e.message;
      }
    }
    return verifyOrderDto;
  }
}
