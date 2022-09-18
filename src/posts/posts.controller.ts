import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';

@Controller('posts')
export class PostsController extends BaseController {
  constructor(private readonly postsService: PostsService) {
    super();
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    const { status, message, post } = await this.postsService.create(
      createPostDto,
    );
    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { post });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const posts = await this.postsService.findAll();
    return this.success(res, { posts });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postsService.findOne(id);
    return this.success(res, { post });
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { status, post, message } = await this.postsService.update(
      id,
      updatePostDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { post });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
