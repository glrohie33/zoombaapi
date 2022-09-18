import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel } from './entities/post.entity';

@Module({
  imports: [MongooseModule.forFeature([PostModel])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [MongooseModule, PostsService],
})
export class PostsModule {}
