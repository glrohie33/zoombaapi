import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PaymentOptionDocument = PaymentOption & mongoose.Document;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class PaymentOption {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  key: string;
  @Prop({ type: Number })
  downPercent: number;
  @Prop({ type: Number })
  interestRate: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null })
  admin: any;
  @Prop({ type: Boolean, default: true })
  activeStatus: boolean;
}

export const PaymentOptionSchema = SchemaFactory.createForClass(PaymentOption);

export const PaymentOptionsModel = {
  name: 'paymentOptions',
  schema: PaymentOptionSchema,
};
