import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Category } from '../entities/category.entity';
import * as Mongoose from 'mongoose';
import { Express } from 'express';
import { Media } from '../../media/entities/media.entity';
import { Dto } from '../../extensions/dto';
import { Expose } from 'class-transformer';

type ObjectId = Mongoose.Schema.Types.ObjectId;

export class CreateCategoryDto extends Dto {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ type: String, required: false, default: null })
  parent: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiModelProperty({ type: [String],required:false })
  // @IsNotEmpty()
  // @IsArray()
  attributes: ObjectId[];
  @ApiModelProperty({ type: String, format: 'binary', required: false })
  image: any;
  @ApiModelProperty({ type: [String], required: false })
  // @IsNotEmpty()
  // @IsArray()
  tags: string[];
  uploadedFile: Express.Multer.File;
  @ApiModelProperty({ type: [String], required: false })
  platform: string[];
  status = false;
  errorMessage: string | string[];

  @ApiModelProperty({ type: Boolean, default: false,required:false })
  private topCategory;

  category: Category;
  private _media: Media;

  get media(): Media {
    return this._media;
  }

  set media(value: Media) {
    this._media = value;
  }
}
