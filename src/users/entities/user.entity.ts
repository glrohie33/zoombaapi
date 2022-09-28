import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { Meta } from '../../meta/entities/meta.entity';

export type UserDocument = User & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ type: String, required: [true, 'the firstname field is required'] })
  firstname: string;
  @Prop({ type: String, required: [true, 'the lastname field is required'] })
  lastname: string;
  @Prop({
    type: String,
    validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        if (user) {
          return false;
        }
        return true;
      },
      message: ({ value }) => `${value} already exist`,
    },
    required: [true, 'the email field is required'],
    unique: [true, 'This email already exist'],
  })
  email: string;
  @Prop({
    type: String,
    select: false,
    required: [true, 'the email field is required'],
  })
  password: string;
  @Prop({
    type: String,
    validate: {
      validator: async function (username) {
        const user = await this.constructor.findOne({ username });
        if (user) {
          return false;
        }
        return true;
      },
      message: ({ value }) => `${value} already exist`,
    },
    unique: true,
    required: true,
  })
  username: string;
  @Prop({ type: String, default: 'user' })
  role: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'metas' })
  defaultAddress: Meta | string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: null,
  })
  referee: User | string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next, opts) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
  }
  next();
});

UserSchema.virtual('myStores', {
  ref: 'stores',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('metaData', {
  ref: 'metas',
  localField: '_id',
  foreignField: 'modelId',
});

UserSchema.virtual('orders', {
  ref: 'orders',
  localField: '_id',
  foreignField: 'user',
});

export const UserModel = { name: 'users', schema: UserSchema };
