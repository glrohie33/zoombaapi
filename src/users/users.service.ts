import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { JWT_EXPIRES, JWT_TOKEN } from '../utils/config';
import { Request } from '../utils/config';
import { REQUEST } from '@nestjs/core';
import useRealTimers = jest.useRealTimers;
@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectModel('users') private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user = await this.userModel.create(createUserDto);
      createUserDto.newUser = user;
      createUserDto.status = true;
      createUserDto.token = this.generateToken(user);
    } catch (e) {
      createUserDto.errorMessage = [e.message];
    }

    return createUserDto;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id) {
    const returnData: {
      status: boolean;
      user?: UserDocument;
      message?: string;
    } = {
      status: false,
    };

    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error('user not found');
      }
      returnData.user = user;
      returnData.status = true;
    } catch (e) {
      returnData.message = e.message;
    }
    return returnData;
  }

  async getProfile() {
    const user = await this.request.user;
    await user.populate('defaultAddress');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  generateToken(user: UserDocument): string {
    // const data = {
    //   id: user.id,
    //   role: user.role,
    // };
    const data = {};
    const token = jwt.sign(data, JWT_TOKEN, {
      expiresIn: JWT_EXPIRES,
    });
    return token;
  }

  async getOrders() {
    const user = await this.request.user;
    await user.populate('orders', [
      'grandTotal',
      'totalPrice',
      'shippingPrice',
      'paymentStatus',
      'paymentGateway',
      'orderItems',
      'createdAt',
    ]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user.orders;
  }

  async setDefaultShipping(shipping: string) {
    const response: { status: boolean; message: string } = {
      status: false,
      message: '',
    };
    try {
      if (!Boolean(shipping)) {
        throw new Error('shipping address id is empty');
      }

      const user = this.request.user;
      const match: any = { id: shipping, metaType: 'shippingAddress' };
      await user.populate({ path: 'metaData', match });
      const metaData: any = <User>user.toJSON().metaData;

      if (metaData.length < 1) {
        throw new Error('shipping address not found');
      }

      user.defaultAddress = shipping;
      await user.save();
      response.status = true;
    } catch (e) {
      response.message = e.message;
    }
    return response;
  }
}
