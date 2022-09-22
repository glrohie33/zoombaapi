import { Dto } from '../../extensions/dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
} from 'class-validator';
import { KAMPECART, ZOOMBACART } from '../../utils/config';
import { ProductDocument } from '../../products/entities/product.entity';

export class CartDto extends Dto {
  constructor() {
    super();
  }

  @ApiModelProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsArray()
  options: object;

  action: string;

  @IsIn([ZOOMBACART, KAMPECART], {
    message: 'invalid cart',
  })
  cartType: string;
  cart: any[] | any;
  product: ProductDocument;
  products: ProductDocument[];
  sumTotal: number;
  totalWeight: number;
  basket = '';
  basketData: any;
}
