import { Injectable } from '@nestjs/common';
import { ZoombaOrder } from './impl/zoombaOrder';
import { Order } from './order';
import { KampeOrder } from './impl/kampeOrder';

@Injectable()
export class OrderFactory {
  constructor(private zoomba: ZoombaOrder, private kampe: KampeOrder) {}
  getInstance(instance): Order {
    if (!(instance in this)) {
      throw new Error('Order processor does not exist');
    }
    return this[instance] || null;
  }
}
