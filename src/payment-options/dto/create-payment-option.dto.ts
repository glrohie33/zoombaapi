import { Dto } from '../../extensions/dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PaymentOptionDocument } from '../entities/payment-option.entity';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentOptionDto extends Dto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;
  @IsNotEmpty()
  @ApiModelProperty()
  key: string;
  @IsNotEmpty()
  @ApiModelProperty()
  downPercent: number;
  @IsNotEmpty()
  @ApiModelProperty()
  interestRate: number;

  @ApiModelProperty()
  activeStatus: boolean;

  payment: PaymentOptionDocument;
}
