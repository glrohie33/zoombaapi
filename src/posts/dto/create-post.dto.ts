import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Dto } from '../../extensions/dto';
import { PostDocument } from '../entities/post.entity';
import * as mongoose from 'mongoose';

export class CreatePostDto extends Dto {
  @ApiModelProperty({ type: String })
  name: string;
  contents: any;
  postType = 'post';
  meta: '';
  tags: '';
  post: PostDocument;
  postTypeId: mongoose.Schema.Types.ObjectId = null;
}
