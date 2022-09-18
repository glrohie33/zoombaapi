import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';
import { toFloat } from '../../helpers/numberHelpers';
import { v5 as uuidv5 } from 'uuid';
import { METHODS } from 'http';
import { Platform } from 'src/platform/entities/platform.entity';

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
  totalPrice: number;
  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  shippingPrice: number;
  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  vat: number;
  @Prop({ type: [String] })
  coupon: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'platforms' })
  platformId: Platform;
  @Prop({ type: String })
  paymentRef: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  shippingAddress: any;
  @Prop({ type: Array, required: true })
  orderItems: any[];
}

const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = { name: 'orders', schema: OrderSchema };
