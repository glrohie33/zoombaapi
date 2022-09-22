import { Cart } from './carts/cart';
import { ZoombaCart } from './carts/impl/zoombaCart';
import { KampeCart } from './carts/impl/kampeCart';
import { Request } from '../utils/config';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '../products/entities/product.entity';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class CartFactory {
  private instances: { zoomba: Cart; kampe: Cart } = {
    zoomba: null,
    kampe: null,
  };

  constructor(
    @Inject(REQUEST) public req: Request,
    @InjectModel('products') private productModel: Model<ProductDocument>,
  ) {
    this.instances.zoomba = new ZoombaCart(req, this.productModel);
    this.instances.kampe = new KampeCart(req, this.productModel);
  }

  getInstance(cart: string) {
    if (cart in this.instances) {
      return this.instances[cart];
    }
    return null;
  }
}
