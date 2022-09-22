import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { connection, Model } from 'mongoose';
import { PostDocument } from './entities/post.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('posts') private postModel: Model<PostDocument>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<CreatePostDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const newPost = await this.postModel.create(createPostDto);
      if (Boolean(createPostDto.homePage)) {
        await this.removePreviousHomePage(createPostDto.homePage, newPost.id);
      }
      createPostDto.post = newPost;
      createPostDto.status = true;
      await session.commitTransaction();
    } catch (e) {
      console.log(e);
      createPostDto.message = ['there is an error creating post'];
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return createPostDto;
  }

  async removePreviousHomePage(slug, id) {
    await this.postModel.findOneAndUpdate(
      { homePage: slug, _id: { $ne: id } },
      { homePage: '' },
    );
  }

  async findAll() {
    let posts: PostDocument[] = [];
    try {
      posts = await this.postModel.find();
    } catch (e) {
      console.log(e.message);
    }
    return posts;
  }

  async findOne(slug: string, filter = 'slug') {
    let post: PostDocument = null;
    try {
      post = await this.postModel.findOne({ [filter]: slug }).populate({
        path: 'contents',
        populate: { path: 'items' },
      });
    } catch (e) {
      console.log(e.message);
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    let postupdate: PostDocument = null;

    try {
      const post = await this.postModel.findById(id);
      if (Boolean(post)) {
        postupdate = await this.postModel.findByIdAndUpdate(id, updatePostDto);
        updatePostDto.status = true;
        updatePostDto.post = postupdate;
        if (Boolean(updatePostDto.homePage)) {
          await this.removePreviousHomePage(
            updatePostDto.homePage,
            postupdate.id,
          );
        }
      } else {
        throw new Error('post does not exist');
      }
    } catch (e) {
      console.log(e.message);
      updatePostDto.message = 'post does not exist';
    }
    return updatePostDto;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async createPost(
    name: string,
    id: mongoose.Schema.Types.ObjectId,
    postType: string,
    content: any = [],
  ): Promise<PostDocument> {
    const createPostDto = new CreatePostDto();
    createPostDto.name = name;
    createPostDto.postType = postType;
    createPostDto.contents = content;
    createPostDto.postTypeId = id;
    let post: PostDocument = null;
    const InsertedPost = await this.create(createPostDto);
    if (!InsertedPost.status) {
      throw new Error('there is an error creating this post');
    }
    post = InsertedPost.post;

    return post;
  }
}
