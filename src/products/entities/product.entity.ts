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
import {generateSlug} from "../../utils/mongooseValidator";

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

  @Prop({ type: Number, set: (v) => toFloat(Number(v), 2), default: 0 })
  vat: number;

  @Prop({ type: Number, set: (v) => toFloat(v, 2), default: 0 })
  discount: number;

  @Prop({ type: String, enum: ['percentage', 'price'] })
  discountType: string;

  @Prop({ type: [], set: (v) => (v ? JSON.parse(v) : []) })
  variations: any[];

  @Prop({ type: String, required: true, min: 30 })
  description: string;

  @Prop({ type: String, required: true, min: 30 })
  features: string;

  @Prop({ type: [String], set: (v) => v.split(','), required: true })
  tags: string[];

  @Prop({ type: String })
  mainImage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'stores' })
  store: Store;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;

  @Prop({ type: String, ref: 'platforms' })
  platform: Platform;

  @Prop({ type: {}, set: (v) => (v ? JSON.parse(v) : {}) })
  attributes: any;

  @Prop({ type: Number, default: 0 })
  quantity: number;

  @Prop({
    type: String,
  })
  slug: string;

  @Prop({ type: String })
  modelNumber: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', async function (next, opts) {
  this.slug = await generateSlug(this.name, this.constructor, 'name');

  next();
});

ProductSchema.virtual('productImages', {
  ref: 'medias',
  localField: '_id',
  foreignField: 'model',
});

export const ProductModel = { name: 'products', schema: ProductSchema };
