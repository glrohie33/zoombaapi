import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { filterObject, Request } from '../utils/config';
import { BaseParams } from '../params/baseParams';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectModel('products') private productModel: Model<ProductDocument>,
    private mediaService: MediaService,
    private postService: PostsService,
    @InjectConnection() private connection: mongoose.Connection,
    private logger: Logger,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<CreateProductDto> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      const product = await this.productModel.create(createProductDto);

      const files = await this.mediaService.uploadFiles(
        createProductDto.uploadedFiles,
        product.id,
        'products',
      );

      if (files && files.length > 0) {
        product.update({ mainImage: files[0].url });
      }

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
    const platform = this.req.headers['platform'];
    const { price, brand, currentPage, perPage, categories, search } = params;
    const allFilters = { price, brand, categories };
    const filters: any = filterObject(allFilters);
    let products: any = [];
    let total = 0;
    const { getFilters, filterBy } = params;
    if (getFilters) {
      filters[filterBy] = getFilters;
    }

    // if (platform) {
    //   filters.platform = platform;
    // }

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
    try {
      await this.updateProduct(updateProductDto);
      await this.uploadNewProducts(updateProductDto);
      this.removeDeletedImages(updateProductDto);
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

  async updateProduct(updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      updateProductDto.id,
      updateProductDto,
    );
    updateProductDto.product = product;
  }

  async uploadNewProducts(updateProductDto: UpdateProductDto) {
    if (updateProductDto.uploadedFiles.length > 0) {
      const files = await this.mediaService.uploadFiles(
        updateProductDto.uploadedFiles,
        updateProductDto.product.id,
        'products',
      );

      const mainImageExist = await this.mediaService.findImageWithField(
        'url',
        updateProductDto.product.mainImage,
      );
      if (
        !mainImageExist ||
        updateProductDto.deletedImages.includes(
          updateProductDto.product.mainImage,
        )
      ) {
        await updateProductDto.product.updateOne({
          $set: { mainImage: files[0].url },
        });
      }
    }
  }

  removeDeletedImages({ product, deletedImages }: UpdateProductDto) {
    if (deletedImages.length > 0) {
      this.mediaService.deleteImages(product.id, 'products', deletedImages);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async getPostData(query: BaseParams) {
    const product = await this.findOne(query.postTypeId);
    return { productDetails: product, view: 'productView' };
  }
}
