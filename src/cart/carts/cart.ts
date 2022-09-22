import { CartDto } from '../dto/cart-dto';
import { Response } from 'express';
import { COOKIE_EXPIRE, Request } from '../../utils/config';
import mongoose, { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDocument } from '../../products/entities/product.entity';

export abstract class Cart {
  abstract cartType: string;
  req: Request;

  protected constructor(private productModel: Model<ProductDocument>) {}

  getCart(cartDto: CartDto) {
    cartDto.cart = this.req.cookies[this.cartType] || [];
  }

  mapProducts(cartDto) {
    cartDto.products.forEach((product) => {
      const index = cartDto.cart.findIndex((c) => c.productId == product.id);
      const cart = cartDto.cart[index];
      cart.productId = product.id;
      cart.productName = product.name;
      cart.brand = product.brand.name;
      cart.mainImage = product.mainImage;
      cart.price = product.price;
      cart.purchasePrice = product.purchasePrice;
      cart.seller = product.store.user;
      cart.weight = cart.quantity * product.weight;
      cart.total = product.price * cart.quantity;
      cart.unit = product.unit;
      cartDto.cart[index] = cart;
    });
  }

  getSumTotal(cartDto) {
    cartDto.sumTotal = cartDto.cart.reduce((a, b) => a + b.total, 0);
  }

  getTotalWeight(cartDto: CartDto) {
    cartDto.totalWeight = cartDto.cart.reduce((a, b) => a + b.weight, 0);
  }

  async getProduct(cartDto) {
    cartDto.product = await this.productModel
      .findById(cartDto.productId)
      .select(['quantity', 'variations', 'price']);
  }

  async buildCart(cartDto: CartDto) {
    this.getCart(cartDto);
    await this.getProducts(cartDto);
    this.mapProducts(cartDto);
    this.getSumTotal(cartDto);
    this.getTotalWeight(cartDto);
    return cartDto;
  }

  verifyQuantity(cartDto) {
    //check if product is not a variable product
    if (cartDto.product.variations.length > 0) {
    } else {
      return cartDto.product.quantity >= cartDto.quantity;
    }
  }

  removeItem(cartDto) {
    cartDto.cart = cartDto.cart.filter(
      (item) => item.productId !== cartDto.productId,
    );
  }

  saveCart(cartDto, res) {
    res.cookie(this.cartType, cartDto.cart, {
      expires: COOKIE_EXPIRE,
      httpOnly: true,
      secure: false,
    });
  }

  insertItem(cartDto: CartDto) {
    const { cart, productId, quantity, options } = cartDto;
    const itemIndex = cart.findIndex((item) => item.productId == productId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
      cartDto.cart = cart;
    } else {
      cartDto.cart.push({ productId, quantity, options });
    }
  }

  async verifyGeneralRule(cartDto) {
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
      .populate('store', ['user']);
  }

  clearCart(res: Response) {
    res.clearCookie(this.cartType);
  }

  abstract createCart(cartDto: CartDto, res: Response);

  abstract getItems(cartDto: CartDto);
}
