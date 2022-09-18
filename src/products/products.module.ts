import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Product, ProductModel} from "./entities/product.entity";
import {MediaModule} from "../media/media.module";
import {PostsModule} from "../posts/posts.module";

@Module({
  imports:[MongooseModule.forFeature([ProductModel]),MediaModule,PostsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[MongooseModule,ProductsService]
})
export class ProductsModule {}
