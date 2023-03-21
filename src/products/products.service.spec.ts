import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel } from './entities/product.entity';
import { MediaModule } from '../media/media.module';
import { PostsModule } from '../posts/posts.module';
import { MediaModel } from '../media/entities/media.entity';
import { MediaController } from '../media/media.controller';
import { MediaService } from '../media/media.service';
import { PostModel } from '../posts/entities/post.entity';
import { PostsController } from '../posts/posts.controller';
import { PostsService } from '../posts/posts.service';
import mongourl from "../utils/mongourl";
import {Logger} from "@nestjs/common";

const file = {
  fieldname: 'file',
  originalname: 'file',
  mimetype: 'jpeg',
  size: 2342323,
};
const testData: any = {
  name: 'home-bar',
  store: '63cacf83eadb50ff8783025b',
  features:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  tags: 'tag,name',
  unit: 'pc',
  brand: '63cacf83eadb50ff8783025b',
  categories: ['63cacf83eadb50ff8783025b'],
  quantity: '2',
  salesPrice: '0',
  attributes: '{}',
  variations: '[]',
  vat: '0',
  weight: '2',
  purchasePrice: '200000',
  uploadedFiles: [file],
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongourl.url),
        MongooseModule.forFeature([ProductModel]),
        PostsModule,
        MediaModule,
      ],
      providers: [ProductsService, Logger],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not throw Error', () => {
    const productDto = Object.assign(new CreateProductDto(), testData);
    console.log(productDto);
  });
});
