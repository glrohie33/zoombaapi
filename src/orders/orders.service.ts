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

@Injectable()
export class OrdersService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private cartService: CartService,
    private shippingService: ShippingService,
    private gatewayFactory: GatewayFactory,
    private metaService: MetaService,
    private orderItemsService: OrderItemsService,
    @InjectModel('orders') private orderModel: Model<OrderDocument>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderDto> {
    const session = await this.connection.startSession();
    const transaction = await session.startTransaction();
    try {
      const cartDto = new CartDto();
      cartDto.cartType = createOrderDto.cartType;
      createOrderDto.cart = await this.cartService.buildCart(cartDto);

      await this.getShippingAddress(createOrderDto);
      await this.getShippingPrice(createOrderDto);
      createOrderDto.totalPrice = createOrderDto.cart.sumTotal;
      createOrderDto.grandTotal =
        createOrderDto.cart.sumTotal + createOrderDto.shippingPrice;
      createOrderDto.orderItems = createOrderDto.cart.cart;
      createOrderDto.user = this.req.user.id;
      const order = await this.orderModel.create(createOrderDto);
      createOrderDto.order = order;
      createOrderDto.order.orderCode = uuidv5('order' + order.id, uuidv5.URL);
      createOrderDto.order.paymentRef = this.generatePaymentRef(createOrderDto);
      await createOrderDto.order.save();
      await session.commitTransaction();
      createOrderDto.status = true;
    } catch (e) {
      await session.abortTransaction();
      console.log(e);
      createOrderDto.message = e.message;
    } finally {
      await session.endSession();
    }

    return createOrderDto;
  }

  generatePaymentRef(createOrderDto: CreateOrderDto) {
    return this.gatewayFactory
      .getInstance(createOrderDto.paymentGateway)
      .generateRef(createOrderDto.order._id);
  }

  async getShippingAddress(createOrderDto: CreateOrderDto) {
    const shippingAddress = await this.metaService.findOne(
      createOrderDto.shippingAddressId,
    );
    if (!shippingAddress) {
      throw new Error('shipping address not found');
    }
    createOrderDto.shippingAddress = shippingAddress.data;
  }

  async getShippingPrice(createOrderDto: CreateOrderDto) {
    const {
      shippingAddress: { city, townCode },
      cart: { totalWeight },
    } = createOrderDto;
    const shippingDto = new CreateShippingDto();
    shippingDto.to = city;
    shippingDto.weight = <string>(<unknown>totalWeight);
    if (townCode) {
      shippingDto.forwarding = townCode;
    }
    console.log(shippingDto);
    const { status, fee } = await this.shippingService.getDeliveryPrice(
      shippingDto,
    );
    console.log(status, fee);
    if (fee == 0 || !status) {
      throw new Error('cannot process order please try again later');
    }
    createOrderDto.shippingPrice = fee;
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

  async verifyOrder(verifyOrderDto: VerifyOrderDto): Promise<VerifyOrderDto> {
    const order = await this.findOne(verifyOrderDto.orderId).populate(
      'platformId',
    );
    if (!order) {
      verifyOrderDto.message = [
        'order does not exist and could not be verified',
      ];
    } else {
      const { status } = await this.gatewayFactory
        .getInstance(order.paymentGateway)
        .verifyPayment(verifyOrderDto);
      if (status) {
        order.paymentStatus = 'complete';
        order.save();
        verifyOrderDto.status = true;
        this.finalizeOrder(order);
        this.cartService.clearCart(
          `${order.platformId.name}Cart`,
          verifyOrderDto.res,
        );
      }
    }

    return verifyOrderDto;
  }

  finalizeOrder(order) {
    console.log('here');
    order.orderItems.forEach(async (item) => {
      const createOrderItemDto = new CreateOrderItemDto();
      createOrderItemDto.productId = item.productId;
      createOrderItemDto.productName = item.productName;
      createOrderItemDto.price = item.price;
      createOrderItemDto.purchasePrice = item.purchasePrice;
      createOrderItemDto.quantity = item.quantity;
      createOrderItemDto.seller = item.seller;
      createOrderItemDto.orderId = order._id;
      await this.orderItemsService.create(createOrderItemDto);
    });
  }
}
