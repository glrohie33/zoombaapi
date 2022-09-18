import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PlatformDocument = Platform & mongoose.Document;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Platform {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop({
    type: String,
    slug: 'name',
    unique: true,
    require: true,
    slug_padding_size: 1,
  })
  slug: string;
  @Prop({ type: String, unique: true })
  platformKey: string;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);

PlatformSchema.virtual('products', {
  ref: 'products',
  localField: '_id',
  foreignField: 'platform',
});

PlatformSchema.virtual('categories', {
  ref: 'categories',
  localField: '_id',
  foreignField: 'platform',
});

PlatformSchema.virtual('image', {
  ref: 'medias',
  localField: '_id',
  foreignField: 'model',
});

export const PlatformModel = { name: 'platforms', schema: PlatformSchema };
