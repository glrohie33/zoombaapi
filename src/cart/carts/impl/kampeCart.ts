import { Cart } from '../cart';
import { CartDto } from '../../dto/cart-dto';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '../../../utils/config';
import { Model } from 'mongoose';
import { ProductDocument } from '../../../products/entities/product.entity';
import { Response } from 'express';
export class KampeCart extends Cart {
  cartType = 'kampeCart';
  constructor(req: Request, productModel: Model<ProductDocument>) {
    super(productModel);
    this.req = req;
  }

  getBasket(cartDto: CartDto) {
    const baskets: any = {
      mini: {
        title: 'zoomba mini',
        min: 15000,
        max: 20000,
      },
      basic: {
        title: 'zoomba basic',
        min: 21000,
        max: 50000,
      },
      oga: {
        title: 'zoomba mini',
        min: 51000,
        max: 100000,
      },
      igwe: {
        title: 'zoomba mini',
        min: 100000,
        max: Infinity,
      },
    };

    if (!Boolean(cartDto.basket)) {
      return (cartDto.basketData = false);
    }

    cartDto.basketData = cartDto.basket;
  }

  async createCart(cartDto: CartDto, res: Response) {
    if(!Boolean(cartDto.basket)){
      throw new Error('please select a cart');
    }
    this.getCart(cartDto);
    await this.verifyGeneralRule(cartDto);
    await this.buildCart(cartDto);
    this.getBasket(cartDto);

    if (!cartDto.basketData) {
      throw new Error('Opps seems like this basket is not available');
    }
    const { sumTotal, basketData } = cartDto;

    if (sumTotal > basketData) {
      throw new Error(
        'Opps your basket is a little bit more that the capacity can you adjust please',
      );
    }

    this.saveCart(cartDto, res);
  }

  async getItems(cartDto: CartDto) {
    this.getCart(cartDto);
    await this.buildCart(cartDto);
  }
}
