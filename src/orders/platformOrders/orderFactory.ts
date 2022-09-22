import { Injectable } from '@nestjs/common';
import { ZoombaOrder } from './impl/zoombaOrder';
import {Order} from "./order";

@Injectable()
export class OrderFactory {
  constructor(private zoomba: ZoombaOrder) {}
  getInstance(instance) : Order{
    if (!(instance in this)) {
      throw new Error('Order processor does not exist');
    }
    return this[instance] || null;
  }
}
