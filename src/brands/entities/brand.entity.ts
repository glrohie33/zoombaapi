import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Media } from '../../media/entities/media.entity';
import { Store } from '../../stores/entities/store.entity';
import * as slug from 'mongoose-slug-generator';
mongoose.plugin(slug);
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
    unique: true,
    slug_padding_size: 1,
  })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'stores' })
  officialStore: Store | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'medias' })
  image: Media;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = { name: 'brands', schema: BrandSchema };
