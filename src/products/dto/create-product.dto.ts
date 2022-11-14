import {
  isArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Dto } from '../../extensions/dto';
import { Product, ProductDocument } from '../entities/product.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateProductDto extends Dto {
  constructor() {
    super();
  }
  @ApiModelProperty({ type: String })
  purchasePrice: number;
  @ApiModelProperty({ type: String })
  weight: number;
  @ApiModelProperty({ type: String })
  vat: number;
  @ApiModelProperty({ type: String, required: false })
  variations = '[]';
  @ApiModelProperty({ type: String, required: false })
  attributes = '{}';

  @ApiModelProperty({ type: String })
  salesPrice = 0;
  @ApiModelProperty({ type: String })
  quantity: number;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ type: [String] })
  @IsNotEmpty()
  categories: any[];

  @ApiModelProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  brand: Brand;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  unit: string;

  // @ApiModelProperty({type: [String]})
  // @IsNotEmpty()
  // tags: string[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  description: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  features: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  store: string;

  product: ProductDocument;

  @Expose()
  get price(): number {
    const purchasePrice = this.purchasePrice - this.salesPrice;
    const interest = purchasePrice * (10 / 100);
    return purchasePrice + interest;
  }

  set price(price: number) {}

  mainImage: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  sku: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  modelNumber: string;

  uploadedFiles: Express.Multer.File[];
}
