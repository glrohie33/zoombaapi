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
  productPurchasePrice: number;
  productWeight: number;

  productVat: number;

  productVariations = '[]';

  productAttributes = '{}';

  salesPrice = 0;

  productQuantity: number;
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
  get vat(): number {
    return <number>this.productVat;
  }

  set vat(value: number) {}

  @Expose()
  get purchasePrice(): number {
    return <number>this.productPurchasePrice;
  }

  set purchasePrice(value: number) {}

  @Expose()
  get variations(): any {
    return JSON.parse(this.productVariations);
  }

  set variations(value: any) {}

  @Expose()
  get attributes(): any {
    const attributes = JSON.parse(this.productAttributes);
    return attributes;
  }

  set attributes(value: any) {}

  @Expose()
  get weight(): number {
    return <number>this.productWeight;
  }

  set weight(value: number) {}

  @Expose()
  get price(): number {
    const purchasePrice = this.purchasePrice - this.salesPrice;
    const interest = purchasePrice * (10 / 100);
    return purchasePrice + interest;
  }

  set price(price: number) {}

  @Expose()
  get quantity(): number {
    return this.productQuantity;
  }

  set quantity(value: number) {}

  @Expose()
  get discount(): number {
    const diff = this.purchasePrice - this.salesPrice;
    const discount = this.salesPrice / this.purchasePrice;
    return discount * 100;
  }

  set discount(value: number) {}

  mainImage: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  sku: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  modelNumber: string;

  uploadedFiles: Express.Multer.File[];
}
