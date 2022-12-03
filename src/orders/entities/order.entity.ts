import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';
import { toFloat } from '../../helpers/numberHelpers';
import { v5 as uuidv5 } from 'uuid';
import { METHODS } from 'http';
import { Platform } from 'src/platform/entities/platform.entity';
import { type } from 'os';
import { Subscription } from 'rxjs';

export type OrderDocument = Order & mongoose.Document;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({ type: String })
  orderCode: string;
  @Prop({ type: String, required: true })
  paymentGateway: string;
  @Prop({ type: Boolean, required: true, default: false })
  status: boolean;
  @Prop({
    type: String,
    enum: ['incomplete', 'processing', 'complete'],
    default: 'incomplete',
  })
  paymentStatus: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;
  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  grandTotal: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  downPayment: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  totalPrice: number;
  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  shippingPrice: number;
  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  vat: number;
  @Prop({ type: [String] })
  coupon: string[];
  @Prop({ type: String })
  platform: string;
  @Prop({ type: String })
  paymentRef: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  shippingAddress: any;
  @Prop({ type: Array, required: true })
  orderItems: any[];
  @Prop({ type: Number, default: null })
  subscriptionPeriod: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subscriptions',
    default: null,
  })
  subscription: Subscription;
}

const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.virtual('requests', {
  ref: 'requests',
  localField: '_id',
  foreignField: 'modelId',
});
export const OrderModel = { name: 'orders', schema: OrderSchema };
