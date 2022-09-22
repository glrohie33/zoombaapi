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

export abstract class Order {
  protected abstract gatewayFactory: GatewayFactory;
  protected abstract metaService: MetaService;
  protected abstract shippingService: ShippingService;
  protected abstract orderItemsService: OrderItemsService;
  protected abstract cartService: CartService;
  protected abstract connection: mongoose.Connection;
  protected abstract req: Request;
  protected abstract orderModel: Model<OrderDocument>;

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
      order.save();
      verifyOrderDto.status = true;
      this.finalizeOrder(order);
      this.cartService.clearCart(
        verifyOrderDto.res,
      );
    }
    return verifyOrderDto;
  }

  async insterOrder(createOrderDto) {
    const session = await this.connection.startSession();
    const transaction = await session.startTransaction();
    try {
      const cartDto = new CartDto();
      cartDto.cartType = createOrderDto.cartType;
      createOrderDto.cart = await this.cartService.getCart(cartDto);
      await this.getShippingAddress(createOrderDto);
      await this.getShippingPrice(createOrderDto);
      createOrderDto.totalPrice = createOrderDto.cart.sumTotal;
      createOrderDto.grandTotal =
        createOrderDto.cart.sumTotal + createOrderDto.shippingPrice;
      createOrderDto.orderItems = createOrderDto.cart.cart;

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
  }
  abstract createOrder(createOrderDto: CreateOrderDto);

  abstract postOrderAction();
}
