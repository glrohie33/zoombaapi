import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MetaDocument = Meta & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Meta {
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'modelDocument' })
  modelId: string;
  @Prop({ type: String })
  modelDocument: any;
  @Prop({ type: String })
  dataType: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

const MetaSchema = SchemaFactory.createForClass(Meta);
export const MetaModel = { name: 'metas', schema: MetaSchema };
