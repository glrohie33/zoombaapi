import { Injectable } from '@nestjs/common';
import { CreatePaymentOptionDto } from './dto/create-payment-option.dto';
import { UpdatePaymentOptionDto } from './dto/update-payment-option.dto';
import { PaymentOptionDocument } from './entities/payment-option.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentOptionsService {
  constructor(
    @InjectModel('paymentOptions')
    private paymentOptionModel: Model<PaymentOptionDocument>,
  ) {}
  async create(createPaymentOptionDto: CreatePaymentOptionDto) {
    try {
      const find = await this.paymentOptionModel.findOne({
        key: createPaymentOptionDto.key,
      });


      if (Boolean(find)) {
        throw Error(`${createPaymentOptionDto.key} already exists`);
      }
      const paymentOption = await this.paymentOptionModel.create(
        createPaymentOptionDto,
      );
      createPaymentOptionDto.status = true;
      createPaymentOptionDto.payment = paymentOption;
    } catch (e) {
      createPaymentOptionDto.message = [e.message];
    }

    return createPaymentOptionDto;
  }

  findAll() {
    return this.paymentOptionModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentOption`;
  }

  update(id: number, updatePaymentOptionDto: UpdatePaymentOptionDto) {
    return `This action updates a #${id} paymentOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentOption`;
  }
}
