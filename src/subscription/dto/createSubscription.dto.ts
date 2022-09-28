import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from '../../orders/platformOrders/order';
import { SubscriptionDocument } from '../entity/subscription.entity';
import {Dto} from "../../extensions/dto";

export class CreateSubscriptionDto extends Dto{
  serviceId:  string;
  service:string = 'order';
  subscriptionPeriod: number;
  from: Date;
  to: Date;
  subscription: SubscriptionDocument;
}
