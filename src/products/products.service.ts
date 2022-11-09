import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, QueryWithHelpers } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { MediaService } from '../media/media.service';
import { ProductParams } from './dto/productParams';
import { PostsService } from '../posts/posts.service';
import * as Mongoose from 'mongoose';
import { filterObject } from '../utils/config';
import { BaseParams } from '../params/baseParams';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products') private productModel: Model<ProductDocument>,
    private mediaService: MediaService,
    private postService: PostsService,
    @InjectConnection() private connection: mongoose.Connection,
    private logger: Logger,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<CreateProductDto> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    console.log('here');
    try {
      const product = await this.productModel.create(createProductDto);
      const files = await this.mediaService.uploadFiles(
        createProductDto.uploadedFiles,
        product.id,
        'products',
      );
      product.mainImage = files[0].url;
      product.save();
      await this.postService.createPost(product.name, product.id, 'products');
      createProductDto.product = product;
      createProductDto.status = true;
      await session.commitTransaction();
    } catch (e) {
      this.logger.log(e.message);
      await session.abortTransaction();
      createProductDto.message = 'sorry your product cannot be created for now';
    } finally {
      await session.endSession();
    }
    return createProductDto;
  }

  async findAll(params: ProductParams) {
    const { price, brand, currentPage, perPage, categories, search } = params;
    const allFilters = { price, brand, categories };
    const filters: any = filterObject(allFilters);
    console.log(filters);
    let products: any = [];
    let total = 0;
    const { getFilters, filterBy } = params;
    if (getFilters) {
      filters[filterBy] = getFilters;
    }

    // products = await this.productModel.find()
    const reg = new RegExp(search, 'i');
    products = await this.productModel
      .find(filters)
      .populate('categories', ['name'])
      .populate('brand', ['name'])
      .regex('name', reg)
      .skip(perPage * (currentPage - 1))
      .limit(perPage);

    total = await this.productModel.find(filters).regex('name', reg).count();
    // if(filters){
    //  await products.where(filters);
    // }
    // await products.populate('categories', ['name']);

    return { products, total };
  }

  findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate('brand', ['name'])
      .populate('categories', ['name'])
      .populate('productImages');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const session = await this.connection.startSession();
    await session.startTransaction();
    const { deletedImages } = updateProductDto;
    console.log(updateProductDto.purchasePrice);
    try {
      const product = await this.productModel.findByIdAndUpdate(
        updateProductDto.id,
        updateProductDto,
      );
      if (updateProductDto.uploadedFiles.length > 0) {
        const files = await this.mediaService.uploadFiles(
          updateProductDto.uploadedFiles,
          product.id,
          'products',
        );
        if (deletedImages.includes(product.mainImage)) {
          product.mainImage = files[0].url;
          product.save();
        }
      }

      if (deletedImages.length > 0) {
        this.mediaService.deleteImages(product.id, 'products', deletedImages);
      }

      updateProductDto.product = product;
      updateProductDto.status = true;
      await session.commitTransaction();
    } catch (e) {
      this.logger.log(e.message);
      await session.abortTransaction();
      updateProductDto.message = 'sorry your product cannot be created for now';
    } finally {
      await session.endSession();
    }
    return updateProductDto;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async getPostData(query: BaseParams) {
    const product = await this.findOne(query.postTypeId);
    return { productDetails: product, view: 'productView' };
  }
}
