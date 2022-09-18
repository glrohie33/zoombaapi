import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Media } from '../../media/entities/media.entity';
import { Product } from '../../products/entities/product.entity';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Content {
  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Number })
  cols: number;
  @Prop({ type: String })
  isCentered: string;
  @Prop({ type: Boolean })
  hideImageName: boolean;
  @Prop({
    type: [{type:mongoose.Schema.Types.ObjectId,refPath: 'contents.itemsType'}],
  })
  items: Media[] | Product[];

  @Prop({ type: String })
  itemsType: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
