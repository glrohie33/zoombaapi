import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Media } from '../../media/entities/media.entity';
import { Store } from '../../stores/entities/store.entity';
import { generateSlug } from '../../utils/mongooseValidator';
export type BrandDocument = Brand & mongoose.Document;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    slug: 'name',
  })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'stores' })
  officialStore: Store | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'medias' })
  image: Media;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('save', async function (next, opts) {
  this.slug = await generateSlug(this.name, this.constructor, 'name');

  next();
});

export const BrandModel = { name: 'brands', schema: BrandSchema };
