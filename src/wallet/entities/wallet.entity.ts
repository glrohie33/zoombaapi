import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';
import { toFloat } from '../../helpers/numberHelpers';
import * as mongoose from 'mongoose';

export type WalletDocument = Wallet & mongoose.Document;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Wallet {
  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0.0 })
  availableBalance: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  user: User;
  @Prop({ type: Number, default: 0 })
  walletType: number;
}

const WalletSchema = SchemaFactory.createForClass(Wallet);
export const WalletModel = { name: 'wallets', schema: WalletSchema };
