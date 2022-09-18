import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { Product } from '../../products/entities/product.entity';
import { Brand } from '../../brands/entities/brand.entity';
export type MediaDocument = Media & mongoose.Document;
@Schema({ timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true} })
export class Media {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: [] })
  fileType: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'docModel' })
  model: Category | Store | User | Product | Brand;
  @Prop({ type: String })
  docModel: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  link: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  user: User;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

export const MediaModel = { name: 'medias', schema: MediaSchema };
