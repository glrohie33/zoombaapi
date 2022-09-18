import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PaymentOptionsService } from './payment-options.service';
import { CreatePaymentOptionDto } from './dto/create-payment-option.dto';
import { UpdatePaymentOptionDto } from './dto/update-payment-option.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import {PaymentOptionDocument} from "./entities/payment-option.entity";

@Controller('payment-options')
export class PaymentOptionsController extends BaseController {
  constructor(private readonly paymentOptionsService: PaymentOptionsService) {
    super();
  }

  @Post()
  async create(
    @Body() createPaymentOptionDto: CreatePaymentOptionDto,
    @Res() res: Response,
  ) {
    const { payment, status, message } =
      await this.paymentOptionsService.create(createPaymentOptionDto);
    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { payment});
  }

  @Get()
  async findAll(@Res() res: Response) {
    let payments: PaymentOptionDocument[] = [];
    payments = await this.paymentOptionsService.findAll();
    return this.success(res, { payments });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentOptionDto: UpdatePaymentOptionDto,
  ) {
    return this.paymentOptionsService.update(+id, updatePaymentOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentOptionsService.remove(+id);
  }
}
