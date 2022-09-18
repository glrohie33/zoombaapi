import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AttributeDocument = Attribute & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Attribute {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: true })
  unit: string[];

  @Prop([String])
  options: string[];
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);

export const AttributeModel = { name: 'attributes', schema: AttributeSchema };
