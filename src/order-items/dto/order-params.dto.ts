import { OrderDocument } from '../../orders/entities/order.entity';
import { BaseParams } from '../../params/baseParams';
import * as mongoose from 'mongoose';

export class OrderParamsDto extends BaseParams {
  constructor() {
    super();
  }
  total: number;
  orders: any;
}
