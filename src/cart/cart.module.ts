import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart-dto';
import { ProductsModule } from '../products/products.module';
import {CartFactoryService} from "../cart-factory/cart-factory.service";
import {CartFactory} from "./cartFactory";


@Module({
  imports: [ProductsModule],
  providers: [
    CartService,
      CartFactoryService,
      CartFactory
  ],
  exports: [CartService],
})
export class CartModule {}
