import { Dto } from '../../extensions/dto';

export class FinanceOrderDto extends Dto {
  filterBy: string;
  status:boolean = false;
}
