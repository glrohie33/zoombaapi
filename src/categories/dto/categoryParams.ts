import { BaseParams } from '../../params/baseParams';

export class CategoryParams extends BaseParams {
  parent = null;
  children = false;
  total:number;
  categories:any;
}
