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

  @Prop({ type: String, unique: true, required: true })
  key: string;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);

PlatformSchema.virtual('products', {
  ref: 'products',
  localField: 'key',
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

PlatformSchema.virtual('homepage', {
  ref: 'posts',
  localField: 'key',
  foreignField: 'homePage',
});

export const PlatformModel = { name: 'platforms', schema: PlatformSchema };
