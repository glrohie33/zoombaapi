import { Inject, Injectable, Scope } from '@nestjs/common';
import { PostsService } from './posts/posts.service';
import { CategoriesService } from './categories/categories.service';
import { BrandsService } from './brands/brands.service';
import { ProductsService } from './products/products.service';
import { HttpService } from '@nestjs/axios';
import { Request } from './utils/config';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  post: any = null;
  factories: any;
  constructor(
    @Inject(REQUEST) private req: Request,
    private postService: PostsService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private productsService: ProductsService,
    private httpService: HttpService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getPost(slug: string, filter = 'slug') {
    const post = await this.postService.findOne(slug, filter);
    if (post) {
      this.post = post.toJSON();
      await this.loadProducts();
    }
    return this.post;
  }

  async loadProducts() {
    const query = this.req.query;
    if (this.post) {
      const { postType, postTypeId } = this.post;
      query.postTypeId = postTypeId;
      if (`${postType}Service` in this && postType != 'post') {
        const post = await this[`${postType}Service`].getPostData(query);
        if (post) {
          const newPost = Object.assign(this.post, post);
          this.post = newPost;
        }
      }
    }
  }
}
