import { Dto } from '../../extensions/dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PaymentOptionDocument } from '../entities/payment-option.entity';
import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { IsMatch } from '../../utils/customValidators';

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

  @ApiModelProperty({ type: String, required: false })
  email: string;

  @ApiModelProperty({ type: String, required: false })
  @ValidateIf((object) => object.email.length > 0)
  @IsString()
  @MinLength(6)
  password: string;

  @ValidateIf((object) => object.email.length > 0)
  @IsString()
  firstname: string;

  @ValidateIf((object) => object.email.length > 0)
  @IsString()
  lastname: string;

  @ValidateIf((object) => object.email.length > 0)
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsMatch('password', {
    message: 'Confirm Password field must match password',
  })
  @ApiModelProperty({ type: String, required: false })
  confirmPassword: string;
}
