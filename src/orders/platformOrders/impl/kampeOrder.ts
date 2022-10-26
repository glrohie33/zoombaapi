import { Order } from '../order';
import { ShippingService } from '../../../shipping/shipping.service';
import { MetaService } from '../../../meta/meta.service';
import { GatewayFactory } from '../../gatewayFactory';
import { CartService } from '../../../cart/cart.service';
import { OrderItemsService } from '../../../order-items/order-items.service';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '../../../utils/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OrderDocument } from '../../entities/order.entity';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { VerifyOrderDto } from '../../dto/verfy-order.dto';
import { SubscriptionService } from '../../../subscription/subscription.service';
import { Subscription } from 'rxjs';
import { CreateSubscriptionDto } from '../../../subscription/dto/createSubscription.dto';
import * as moment from 'moment';
import { SubscriptionDocument } from '../../../subscription/entity/subscription.entity';
import { RepaymentsService } from '../../../repayments/repayments.service';
import { CreateRepaymentDto } from '../../../repayments/dto/create-repayment.dto';
import { WalletDocument } from '../../../wallet/entities/wallet.entity';
import { CreateWalletDto } from '../../../wallet/dto/create-wallet.dto';
import { UserDocument } from '../../../users/entities/user.entity';
import { WalletService } from '../../../wallet/wallet.service';

@Injectable()
export class KampeOrder extends Order {
  protected readonly downPercent: number = 25;
  protected readonly handlingFee:number = 750;
  constructor(
    protected shippingService: ShippingService,
    protected metaService: MetaService,
    protected gatewayFactory: GatewayFactory,
    protected cartService: CartService,
    protected orderItemsService: OrderItemsService,
    private subscriptionService: SubscriptionService,
    private repaymentsService: RepaymentsService,
    @Inject(REQUEST) protected req: Request,
    @InjectConnection() protected connection: mongoose.Connection,
    @InjectModel('orders') protected orderModel: Model<OrderDocument>,
    protected walletService: WalletService,
  ) {
    super();
  }
  async createOrder(createOrderDto: CreateOrderDto) {
    if (createOrderDto.subscriptionPeriod < 4) {
      throw new Error(
        'there is an error the number of months cannot be less than 4',
      );
    }

    await this.insertOrder(createOrderDto);
  }

  async getShippingPrice(createOrderDto: CreateOrderDto) {
    let fee = 1500;
    const {
      cart: { sumTotal },
    } = createOrderDto;
    if (sumTotal > 50000) {
      fee = 2000;
    }
    return fee;
  }

  async finishOrder(verifyOrderDto: VerifyOrderDto) {
    try {
      await this.verifyOrder(verifyOrderDto);
      await this.postOrderAction(verifyOrderDto.order);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async postOrderAction(order: OrderDocument) {
    try {
      const createSubscriptionDto: CreateSubscriptionDto =
        new CreateSubscriptionDto();
      createSubscriptionDto.service = 'Order';
      createSubscriptionDto.serviceId = order.id;
      createSubscriptionDto.from = new Date(Date.now());
      createSubscriptionDto.to = moment()
        .add(order.subscriptionPeriod, 'months')
        .toDate();
      const { status, subscription } = await this.subscriptionService.create(
        createSubscriptionDto,
      );

      if (status) {
        order.subscription = subscription._id;
        await order.save();
        this.createSubscriptionRepayments(order);
        this.addRefferalBonus(order).then((r) => true);
      }
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  createSubscriptionRepayments(order) {
    let i = 0;
    const service = this.repaymentsService;
    const { grandTotal, downPayment, subscription, subscriptionPeriod } = order;
    const eachRepayment = (grandTotal - downPayment) / subscriptionPeriod;
    while (i < subscriptionPeriod) {
      const newRepayment = new CreateRepaymentDto();
      newRepayment.amount = eachRepayment;
      newRepayment.dueDate = moment().add(i, 'months').toDate();
      newRepayment.serviceId = subscription;
      service.create(newRepayment).then((r) => {
        return true;
      });
      i++;
    }
  }

  async addRefferalBonus(order: OrderDocument) {
    await order.populate('user');
    const userOrder = <UserDocument>(<unknown>order.user);
    if (userOrder.referee) {
      const { totalPrice, subscriptionPeriod } = order;
      const zoombaInt = totalPrice * 0.1 * subscriptionPeriod;
      const bonus = zoombaInt * 0.05;
      const createWalletDto = new CreateWalletDto();
      createWalletDto.amount = bonus;
      createWalletDto.user = <string>userOrder.referee;
      try {
        this.walletService.create(createWalletDto).then((r) => true);
      } catch (e) {
        console.log(e.message);
      }
    }
  }
}
