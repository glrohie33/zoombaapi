import { forwardRef, Inject, Injectable, UploadedFile } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { MediaDocument } from '../media/entities/media.entity';
import * as mongoose from 'mongoose';
import { BaseParams } from '../params/baseParams';
import { empty } from 'rxjs';
import { CategoryParams } from './dto/categoryParams';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { REQUEST } from '@nestjs/core';
import { ProductsService } from 'src/products/products.service';
import { ProductParams } from '../products/dto/productParams';
import { Request } from '../utils/config';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectModel('categories') private categoryModel: Model<CategoryDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private mediaService: MediaService,
    private postService: PostsService,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    //begin transaction incase there is any error
    const session = await this.categoryModel.db.startSession();
    session.startTransaction();
    try {
      // createCategoryDto.image = file._id;
      const category = await this.categoryModel.create(createCategoryDto);
      await this.postService.createPost(
        category.name,
        category.id,
        'categories',
      );
      createCategoryDto.status = true;
      createCategoryDto.category = category;
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.log(e.message);
      createCategoryDto.message = [
        'cannot create category for now please try later',
      ];
    } finally {
      await session.endSession();
    }
    return createCategoryDto;
  }

  async findAll(params: CategoryParams) {
    const { platform } = this.req.headers;
    const { currentPage, perPage, search, parent, children } = params;
    const conditions: any = {};
    if (Boolean(children)) {
      conditions.parent = parent || null;
    }

    if (Boolean(platform)) {
      conditions.platforms = { $elemMatch: { $eq: platform } };
    }
    const categoryQuery = this.categoryModel
      .find(conditions)
      .regex('title', search);

    const total = await categoryQuery.clone().count();

    const category = await categoryQuery
      .clone()
      .limit(params.perPage)
      .skip((currentPage - 1) * perPage)
      .populate('categoryImage')
      .populate('attributes', ['name'])
      .populate('parent', ['name'])
      .sort({ createdAt: -1 });

    params.categories = category;
    params.total = total;
    return params;
  }

  findOne(id: string) {
    return this.categoryModel.findById(id).populate('attributes');
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async getPostData(query) {
    const param: ProductParams = Object.assign(new ProductParams(), query);
    param.categoryId = param.postTypeId;
    const product = await this.productService.findAll(param);

    const mainCategory = await this.findOne(param.postTypeId);
    console.log(mainCategory);
    const attributes = mainCategory?.attributes;
    const categoryParam = new CategoryParams();
    categoryParam.parent = param.postTypeId;
    categoryParam.children = true;
    const categoryChildren = await this.findAll(categoryParam);

    return {
      productList: product,
      mainCategory,
      attributes,
      categoryChildren,
      view: 'productList',
    };
  }

  getTopCategories() {
    const platform = this.req.headers['platform'];
    return this.categoryModel.find({
      topCategory: true,
      platforms: { $elemMatch: { $eq: platform } },
    });
  }
}
