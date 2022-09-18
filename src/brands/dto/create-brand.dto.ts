import {
  IS_NOT_EMPTY_OBJECT,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Dto } from '../../extensions/dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {BrandDocument} from '../entities/brand.entity';

export class CreateBrandDto extends Dto {
  constructor() {
    super();
  }

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ type: String, format: 'binary' })
  image: any;
  @ApiModelProperty({ type: String })
  @IsString()
  @IsMongoId()
  officialStore: string;

  brand: BrandDocument;
  uploadedFile: Express.Multer.File;
}
