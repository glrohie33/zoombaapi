import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CartDto } from './dto/cart-dto';
import { Request } from '../utils/config';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../products/entities/product.entity';
import { Model } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import { Cart } from './carts/cart';
import { CartFactory } from './cartFactory';
import { CategoriesService } from '../categories/categories.service';
@Injectable()
export class CartService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  res: Response;
  cart: any;
  cartClass: Cart;
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectModel('products') private productModel: Model<ProductDocument>,
    private cartFactory: CartFactory,
  ) {
    const platform: string = <string>this.req.headers['platform'];
    this.cartClass = this.cartFactory.getInstance(platform || 'zoomba');
  }

  async create(cartDto: CartDto, res: Response): Promise<CartDto> {
    try {
      await this.cartClass.createCart(cartDto, res);
      cartDto.message =
        cartDto.action == 'inc'
          ? 'Item Added to Cart'
          : 'Item Removed From Cart';
      cartDto.status = true;
    } catch (e) {
      cartDto.message = e.message;
    }

    return cartDto;
  }

  async getCart(cartDto: CartDto) {
    await this.cartClass.getItems(cartDto);
    return cartDto;
  }

  clearCart(res) {
    this.cartClass.clearCart(res);
  }
}
