import {Inject, Injectable} from '@nestjs/common';
import { CartDto } from './dto/cart-dto';
import { COOKIE_EXPIRE, COOKIE_NAME, Request } from '../utils/config';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../products/entities/product.entity';
import { Model } from 'mongoose';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import {REQUEST} from "@nestjs/core";
import {reduce} from "rxjs";
@Injectable()
export class CartService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  res: Response;
  cart: any;
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectModel('products') private productModel: Model<ProductDocument>,
  ) {}

  async create(cartDto: CartDto, res: Response): Promise<CartDto> {
    this.getCart(cartDto);
    await this.getProduct(cartDto);

    if (!cartDto.product) {
      this.removeItem(cartDto);
      throw new Error('this product is no longer available');
    }

    if (!this.verifyQuantity(cartDto)) {
      throw new Error('quantity is more than available product');
    }
    if (cartDto.quantity == 0) {
      this.removeItem(cartDto);
    } else {
      this.insertItem(cartDto);
    }

    this.saveCart(cartDto, res);
    cartDto.message =
      cartDto.action == 'add' ? 'Item Added to Cart' : 'Item Removed From Cart';
    cartDto.status = true;
    return cartDto;
  }

  async buildCart(cartDto: CartDto) {
    this.getCart(cartDto);
    await this.getProducts(cartDto);
    this.mapProducts(cartDto);
    console.log(cartDto);
    this.getSumTotal(cartDto);
    this.getTotalWeight(cartDto);
    return cartDto;
  }

  getCart(cartDto) {
    cartDto.cart = this.req.cookies[cartDto.cartType] || [];
  }

  async getProduct(cartDto) {
    cartDto.product = await this.productModel
      .findById(cartDto.productId)
      .select(['quantity', 'variations', 'price']);
  }

  verifyQuantity(cartDto) {
    //check if product is not a variable product
    if (cartDto.product.variations.length > 0) {
    } else {
      console.log(cartDto);
      return cartDto.product.quantity >= cartDto.quantity;
    }
  }

  insertItem(cartDto) {
    const { cart, productId, quantity, options } = cartDto;
    const itemIndex = cart.findIndex((item) => item.productId == productId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
      cartDto.cart = cart;
    } else {
      cartDto.cart.push({ productId, quantity, options });
    }
  }

  removeItem(cartDto) {
    cartDto.cart = cartDto.cart.filter(
      (item) => item.productId !== cartDto.productId,
    );
  }

  async getProducts(cartDto) {
    const ids = cartDto.cart.map((item) => item.productId);
    cartDto.products = await this.productModel
      .find({ _id: { $in: ids } })
      .select([
        'name',
        'price',
        'weight',
        'variations',
        'quantity',
        'mainImage',
        'purchasePrice',
        'unit',
        'seller',
      ])
      .populate('brand', ['name'])
      .populate('store',['user']);
  }

  mapProducts(cartDto) {
    console.log(cartDto.products);
    cartDto.products.forEach((product) => {
      const index = cartDto.cart.findIndex((c) => c.productId == product.id);
      const cart = cartDto.cart[index];
      cart.productId = product.id;
      cart.productName = product.name;
      cart.brand = product.brand.name;
      cart.mainImage = product.mainImage;
      cart.price = product.price;
      cart.purchasePrice=product.purchasePrice;
      cart.seller = product.store.user;
      cart.weight = cart.quantity * product.weight;
      cart.total = product.price * cart.quantity;
      cart.unit = product.unit;
      cartDto.cart[index] = cart;
    });
  }

  getSumTotal(cartDto){
    cartDto.sumTotal = cartDto.cart.reduce((a,b)=>a+b.total,0);
  }

  getTotalWeight(cartDto:CartDto){
    console.log(cartDto.cart);
    cartDto.totalWeight = cartDto.cart.reduce((a,b)=>a+b.weight,0);
  }

  saveCart(cartDto, res) {
    res.cookie(cartDto.cartType, cartDto.cart, {
      expires: COOKIE_EXPIRE,
      httpOnly: true,
      secure: false,
    });
  }

  clearCart(cartName:string,res){
    res.clearCookie(cartName);
  }
}
