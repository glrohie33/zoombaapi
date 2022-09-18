import { PartialType } from '@nestjs/swagger';
import { CreatePaymentOptionDto } from './create-payment-option.dto';

export class UpdatePaymentOptionDto extends PartialType(CreatePaymentOptionDto) {}
