import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RequestDocument = mongoose.Document & Request;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Request {
  @Prop({ type: mongoose.Schema.Types.String })
  type = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'type' })
  modelId: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: any;

  @Prop({ type: Boolean, default: false })
  status: true;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  approvedBy: any;
}

const RequestSchema = SchemaFactory.createForClass(Request);

export const RequestModel = { name: 'requests', schema: RequestSchema };
