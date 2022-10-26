import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Expose } from 'class-transformer';

export class UpdateProductDto extends CreateProductDto {
  constructor() {
    super();
  }
  id: number;
  deletedImages: string[] = [];
}
