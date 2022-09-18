import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

export type OrderItemDocument = OrderItem & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'products' })
  productId: string;

  @Prop({ type: String })
  productName: string;

  @Prop({ type: Number })
  price: string;

  @Prop({ type: Number })
  purchasePrice: string;

  @Prop({ type: Number })
  quantity: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  seller: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'orders' })
  orderId: Order;

  @Prop({ type: String, default: 'pending' })
  shippingStatus: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

export const OrderItemModel = { name: 'orderItems', schema: OrderItemSchema };
