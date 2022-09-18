import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from "mongoose";

export type ShippingDocument = Shipping& mongoose.Document;

@Schema({ timestamps: true })
export class Shipping {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  token: string;
  @Prop({ type: String })
  expiresIn: string;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);

export const ShippingModel = {name:'shippings',schema:ShippingSchema}
