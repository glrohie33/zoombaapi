import { Cart } from '../cart';
import { CartDto } from '../../dto/cart-dto';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '../../../utils/config';
import { Model } from 'mongoose';
import { ProductDocument } from '../../../products/entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Injectable()
export class ZoombaCart extends Cart {
  cartType = 'zoombaCart';
  constructor(req: Request, productModel: Model<ProductDocument>) {
    super(productModel);
    this.req = req;
  }

  async createCart(cartDto: CartDto, res: Response) {
    this.getCart(cartDto);
    await this.verifyGeneralRule(cartDto);
    this.saveCart(cartDto, res);
  }

  async getItems(cartDto: CartDto) {
    this.getCart(cartDto);
    await this.buildCart(cartDto);
  }
}
