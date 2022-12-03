import { Injectable } from '@nestjs/common';
import { CreatePaymentOptionDto } from './dto/create-payment-option.dto';
import { UpdatePaymentOptionDto } from './dto/update-payment-option.dto';
import { PaymentOptionDocument } from './entities/payment-option.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentOptionsService {
  constructor(
    @InjectModel('paymentOptions')
    private paymentOptionModel: Model<PaymentOptionDocument>,
    private usersService: UsersService,
  ) {}
  async create(createPaymentOptionDto: CreatePaymentOptionDto) {
    try {
      const { key, email, firstname, lastname, password } =
        createPaymentOptionDto;
      const paymentOption = await this.paymentOptionModel.findOneAndUpdate(
        { key },
        createPaymentOptionDto,
        {
          upsert: true,
          new: true,
        },
      );
      if (email) {
        const createUserDto = new CreateUserDto();
        createUserDto.email = email;
        createUserDto.firstname = firstname;
        createUserDto.lastname = lastname;
        createUserDto.password = password;
        createUserDto.role = 'finance-manager';
        createUserDto.username = key;
        const { newUser } = await this.usersService.create(createUserDto);
        if (newUser) {
          await paymentOption.updateOne({ $set: { admin: newUser.id } });
        }
      }

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
