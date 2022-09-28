import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Order } from '../../orders/platformOrders/order';
import { toFloat } from '../../helpers/numberHelpers';

export type SubscriptionDocument = Subscription & mongoose.Document;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Subscription {
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'service' })
  serviceId: Order | string;

  @Prop({ type: String, default: 'Order', enum: ['Order'] })
  service: string;

  @Prop({ type: Number })
  subscriptionPeriod: number;

  @Prop({ type: Date })
  from: Date;

  @Prop({ type: Date })
  to: Date;
}

const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export const SubscriptionModel = {
  name: 'subscriptions',
  schema: SubscriptionSchema,
};
