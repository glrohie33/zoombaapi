import { IsNotEmpty } from 'class-validator';
import {Dto} from "../../extensions/dto";

export class CreateShippingDto extends Dto {
  constructor() {
    super();
  }
  @IsNotEmpty()
  weight: string;

  from: string='LAGOS MAINLAND';

  @IsNotEmpty()
  to: string;

  forwarding: string;
  fee:number=0;
}
