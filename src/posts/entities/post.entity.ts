import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Content, ContentSchema } from './subSchema';
import { Platform } from '../../platform/entities/platform.entity';
import {generateSlug} from "../../utils/mongooseValidator";

export type PostDocument = Post & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [ContentSchema], default: [] })
  contents: Content[];

  @Prop({ type: {} })
  pageBanners: any;

  @Prop({
    type: String,
    enum: [
      'categories',
      'stores',
      'users',
      'products',
      'brands',
      'platforms',
      'post',
    ],
  })
  postType: any;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'postType' })
  postTypeId: string;

  @Prop({
    type: String,
    unique: true,
  })
  slug: string;
  @Prop({ type: String, ref: 'platforms' })
  homePage: Platform | string;

  @Prop({ type: String })
  textContent: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export const PostModel = { name: 'posts', schema: PostSchema };

PostSchema.pre('save', async function (next, opts) {
  this.slug = await generateSlug(this.name, this.constructor, 'name');

  next();
});
