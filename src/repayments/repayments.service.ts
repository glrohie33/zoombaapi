import { Injectable } from '@nestjs/common';
import { CreateRepaymentDto } from './dto/create-repayment.dto';
import { UpdateRepaymentDto } from './dto/update-repayment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Repayment, RepaymentDocument } from './entities/repayment.entity';
import { Model } from 'mongoose';

@Injectable()
export class RepaymentsService {
  constructor(
    @InjectModel('repayments') private repaymentModel: Model<RepaymentDocument>,
  ) {}
  async create(createRepaymentDto: CreateRepaymentDto) {
    try {
      const repayment = await this.repaymentModel.create(createRepaymentDto);
      createRepaymentDto.repayment = repayment;
      createRepaymentDto.status = true;
    } catch (e) {
      console.log(e.message);
      createRepaymentDto.message = e.message;
    }

    return createRepaymentDto;
  }

  findAll() {
    return `This action returns all repayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repayment`;
  }

  update(id: number, updateRepaymentDto: UpdateRepaymentDto) {
    return `This action updates a #${id} repayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} repayment`;
  }
}
