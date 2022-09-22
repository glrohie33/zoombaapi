import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../../categories/entities/category.entity';
import * as mongoose from 'mongoose';
import { toFloat } from '../../helpers/numberHelpers';
import { Media, MediaDocument } from '../../media/entities/media.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Store } from '../../stores/entities/store.entity';
import { mongo } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Platform } from '../../platform/entities/platform.entity';
import * as slug from 'mongoose-slug-generator';

mongoose.plugin(slug);
export type ProductDocument = Product & mongoose.Document & mongoose.Schema;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'categories',
  })
  categories: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'brands',
  })
  brand: Brand;

  @Prop({ type: String, required: true, unique: true })
  sku: string;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  purchasePrice: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  price: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  salePrice: number;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), required: true })
  weight: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  vat: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  discount: number;

  @Prop({ type: String, enum: ['percentage', 'price'] })
  discountType: string;

  @Prop({ type: [] })
  variations: any[];

  @Prop({ type: String, required: true, min: 30 })
  description: string;

  @Prop({ type: String, required: true, min: 30 })
  features: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: String })
  mainImage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'stores' })
  store: Store;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;

  @Prop({ type: String, ref: 'platforms' })
  platform: Platform;

  @Prop({ type: {} })
  attributes: any;

  @Prop({ type: Number, default: 0 })
  quantity: number;

  @Prop({
    type: String,
    slug: 'name',
    unique: true,
    require: true,
    slug_padding_size: 1,
  })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('productImages', {
  ref: 'medias',
  localField: '_id',
  foreignField: 'model',
});

export const ProductModel = { name: 'products', schema: ProductSchema };
