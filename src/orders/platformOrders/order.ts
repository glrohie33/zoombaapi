import { CreateOrderDto } from '../dto/create-order.dto';
import { CreateShippingDto } from '../../shipping/dto/create-shipping.dto';
import { GatewayFactory } from '../gatewayFactory';
import { MetaService } from '../../meta/meta.service';
import { ShippingService } from '../../shipping/shipping.service';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
import { OrderItemsService } from '../../order-items/order-items.service';
import { CartService } from '../../cart/cart.service';
import { CartDto } from '../../cart/dto/cart-dto';
import * as mongoose from 'mongoose';
import { v5 as uuidv5 } from 'uuid';
import { Request } from '../../utils/config';
import { OrderDocument } from '../entities/order.entity';
import { Model } from 'mongoose';
import { WalletDocument } from '../../wallet/entities/wallet.entity';

export abstract class Order {
  protected abstract gatewayFactory: GatewayFactory;
  protected abstract metaService: MetaService;
  protected abstract shippingService: ShippingService;
  protected abstract orderItemsService: OrderItemsService;
  protected abstract cartService: CartService;
  protected abstract connection: mongoose.Connection;
  protected abstract req: Request;
  protected abstract orderModel: Model<OrderDocument>;
  protected abstract readonly downPercent: number;
  protected abstract readonly handlingFee: number;
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
    const { status, fee } = await this.shippingService.getDeliveryPrice(
      shippingDto,
    );
    if (fee == 0 || !status) {
      throw new Error('cannot process order please try again later');
    }
    return fee;
  }
  finalizeOrder(order) {
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

  async verifyOrder(verifyOrderDto: VerifyOrderDto): Promise<VerifyOrderDto> {
    const { order } = verifyOrderDto;
    const { status } = await this.gatewayFactory
      .getInstance(order.paymentGateway)
      .verifyPayment(verifyOrderDto);
    if (status) {
      order.paymentStatus = 'complete';
      await order.save();
      verifyOrderDto.status = true;
      this.finalizeOrder(order);
      this.cartService.clearCart(verifyOrderDto.res);
    }
    return verifyOrderDto;
  }

  async insertOrder(createOrderDto) {
    const session = await this.connection.startSession();
    const transaction = await session.startTransaction();
    try {
      const cartDto = new CartDto();

      const subscriptionPeriod =
        createOrderDto.subscriptionPeriod == 0
          ? 1
          : createOrderDto.subscriptionPeriod;
      cartDto.cartType = createOrderDto.cartType;
      createOrderDto.cart = await this.cartService.getCart(cartDto);
      await this.getShippingAddress(createOrderDto);
      const shippingPrice = await this.getShippingPrice(createOrderDto);
      const totalPrice = createOrderDto.cart.sumTotal * subscriptionPeriod;
      console.log(totalPrice);

      createOrderDto.shippingPrice = shippingPrice * subscriptionPeriod;
      createOrderDto.handlingFee = this.handlingFee * subscriptionPeriod;
      createOrderDto.totalPrice = totalPrice;
      createOrderDto.grandTotal =
        createOrderDto.totalPrice + createOrderDto.shippingPrice + createOrderDto.handlingFee;
      console.log(this.handlingFee);
      createOrderDto.orderItems = createOrderDto.cart.cart;
      createOrderDto.downPayment =
        createOrderDto.grandTotal * (this.downPercent / 100);
      createOrderDto.user = this.req.user.id;
      createOrderDto.platform = this.req.headers.platform;
      const order = await this.orderModel.create(createOrderDto);
      createOrderDto.order = order;
      createOrderDto.order.orderCode = uuidv5('order' + order.id, uuidv5.URL);
      createOrderDto.order.paymentRef = this.generatePaymentRef(createOrderDto);
      await createOrderDto.order.save();
      await session.commitTransaction();
      createOrderDto.status = true;
    } catch (e) {
      await session.abortTransaction();
      console.log(e.message);
      createOrderDto.message = e.message;
    } finally {
      await session.endSession();
    }
  }
  abstract createOrder(createOrderDto: CreateOrderDto);

  abstract finishOrder(verifyOrderDto: VerifyOrderDto);

  abstract postOrderAction(order: OrderDocument);

  abstract addRefferalBonus(order: OrderDocument);
}
