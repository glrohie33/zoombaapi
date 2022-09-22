import { BaseParams } from '../../params/baseParams';
import { Expose } from 'class-transformer';
import * as mongoose from 'mongoose';

export class ProductParams extends BaseParams {
  constructor() {
    super();
  }

  filterBy = 'sku';
  filters: string = null;
  private _brand: any;
  private _attributes: any;
  maxPrice: number;
  minPrice = 0;
  orderBy: string;
  order = 'Desc';
  categoryId: string;

  @Expose()
  get brand() {
    return this._brand?.split('|') || '';
  }

  set brand(value: string) {
    this._brand = value;
  }

  @Expose()
  get attributes() {
    return this._attributes?.split('|') || '';
  }

  set attributes(value: string) {
    this._attributes = value;
  }

  @Expose()
  get getFilters(): Array<string> {
    return this.filters && this.filters.split(',');
  }

  @Expose()
  get price() {
    return this.maxPrice && { $range: [this.minPrice, this.maxPrice] };
  }

  @Expose()
  get categories() {
    const { categoryId } = this;
    if (!categoryId) {
      return '';
    }

    return {
      $elemMatch: {
        $eq: categoryId,
      },
    };
  }
}
