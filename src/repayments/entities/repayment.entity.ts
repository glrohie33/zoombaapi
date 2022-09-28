import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { toFloat } from '../../helpers/numberHelpers';
import * as mongoose from 'mongoose';
import { Subscription } from '../../subscription/entity/subscription.entity';

export type RepaymentDocument = Repayment & mongoose.Document;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Repayment {
  @Prop({ type: Number, set: (v) => toFloat(v, 2) })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'service' })
  serviceId: Subscription;

  @Prop({ type: String, default: 'Subscription', enum: ['Subscription'] })
  service: any;

  @Prop({ type: Number, required: true, default: 0 })
  rate: number;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Boolean, default: false })
  repaymentStatus: boolean;

  @Prop({ type: Date, default: null })
  datePaid: Date;
}

const RepaymentSchema = SchemaFactory.createForClass(Repayment);

export const RepaymentModel = { name: 'repayments', schema: RepaymentSchema };
