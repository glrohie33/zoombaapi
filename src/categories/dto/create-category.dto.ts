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

  @ApiModelProperty({ type: String, required: false })
  private _parent: any = null;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiModelProperty({ type: [String] })
  // @IsNotEmpty()
  // @IsArray()
  attributes: ObjectId[];
  @ApiModelProperty({ type: String, format: 'binary' })
  image: any;
  @ApiModelProperty({ type: [String] })
  // @IsNotEmpty()
  // @IsArray()
  tags: string[];
  uploadedFile: Express.Multer.File;
  @ApiModelProperty({ type: [String] })
  platform: string[];
  status = false;
  errorMessage: string | string[];
  private _topCategory = false;
  category: Category;
  private _media: Media;
  @Expose()
  get parent() {
    return this._parent || null;
  }

  set parent(value: any) {
    this._parent = value;
  }

  get media(): Media {
    return this._media;
  }

  set media(value: Media) {
    this._media = value;
  }

  @Expose()
  @ApiModelProperty({ type: Boolean })
  get topCategory(): boolean {
    return this._topCategory;
  }

  set topCategory(value: boolean) {
    this._topCategory = value;
  }
}
