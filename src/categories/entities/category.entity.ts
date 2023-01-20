import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Media } from '../../media/entities/media.entity';
import { Attribute } from '../../attributes/entities/attribute.entity';
import { Platform } from '../../platform/entities/platform.entity';
import {generateSlug} from "../../utils/mongooseValidator";

export type CategoryDocument = Category & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    unique: true,
    require: true,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    set: (v) => v || null,
    default: null,
  })
  parent: this;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    set: (v) => v || null,
    ref: 'medias',
  })
  image: Media;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    set: (v) => v || null,
    ref: 'attributes',
  })
  attributes: Attribute[];

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [String] })
  platforms: string[];
  @Prop({ type: Boolean, default: false })
  topCategory: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.virtual('categoryImage', {
  ref: 'medias',
  localField: '_id',
  foreignField: 'model',
});

CategorySchema.virtual('categoryContent', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'postTypeId',
});

CategorySchema.pre('save', async function (next, opts) {
  this.slug = await generateSlug(this.name, this.constructor, 'name');

  next();
});
export const CategoryModel = { name: 'categories', schema: CategorySchema };
