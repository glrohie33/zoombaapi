import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export type StoreDocument = Store & Document;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Store {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Number, required: true })
  phone: number;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  user: User;

  @Prop({ type: String, required: true })
  entity: string;

  @Prop({ type: String, required: true })
  accountManager: string;

  @Prop({ type: String })
  additionalPhone: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.pre('save', function (next, opts) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
  }

  next();
});

export const StoreModel = { name: 'stores', schema: StoreSchema };
