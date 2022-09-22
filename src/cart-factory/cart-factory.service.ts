import { Inject, Injectable } from '@nestjs/common';
import { Cart } from '../cart/carts/cart';
import { REQUEST } from '@nestjs/core';
import { Request } from '../utils/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '../products/entities/product.entity';
import { ZoombaCart } from '../cart/carts/impl/zoombaCart';
import { KampeCart } from '../cart/carts/impl/kampeCart';

@Injectable()
export class CartFactoryService {
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
