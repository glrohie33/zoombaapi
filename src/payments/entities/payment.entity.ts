import {Prop, Schema} from '@nestjs/mongoose';
import {toFloat} from "../../helpers/numberHelpers";

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Payment {

}
