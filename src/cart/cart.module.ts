import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart-dto';
import {ProductsModule} from "../products/products.module";

@Module({
  imports:[ProductsModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
