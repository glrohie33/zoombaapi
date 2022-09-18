import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as slug from 'mongoose-slug-generator';
import { Media } from '../../media/entities/media.entity';
import { Attribute } from '../../attributes/entities/attribute.entity';
import { Platform } from '../../platform/entities/platform.entity';

export type CategoryDocument = Category & mongoose.Document;
mongoose.plugin(slug);
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
    slug: 'name',
    unique: true,
    require: true,
    slug_padding_size: 1,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    default: null,
  })
  parent: this;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'medias' })
  image: Media;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'attributes' })
  attributes: Attribute[];

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'platforms' })
  platform: Platform[];
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

export const CategoryModel = { name: 'categories', schema: CategorySchema };
