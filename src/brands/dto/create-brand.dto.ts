import {
  IS_NOT_EMPTY_OBJECT,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Dto } from '../../extensions/dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BrandDocument } from '../entities/brand.entity';
import { Expose } from 'class-transformer';

export class CreateBrandDto extends Dto {
  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  get officialStore(): string {
    return this._officialStore || null;
  }

  set officialStore(value: string) {
    this._officialStore = value;
  }
  constructor() {
    super();
  }

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ type: String, format: 'binary' })
  image: any;


  private _officialStore: string = null;

  brand: BrandDocument;
  uploadedFile: Express.Multer.File;
}
