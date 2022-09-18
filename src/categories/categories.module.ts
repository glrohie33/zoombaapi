import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CategoryModel} from "./entities/category.entity";
import {MediaModule} from "../media/media.module";
import {PostsModule} from "../posts/posts.module";
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [MongooseModule.forFeature([CategoryModel]),MediaModule,PostsModule,ProductsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports:[MongooseModule,CategoriesService],
})
export class CategoriesModule {}
