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
import { CreateWalletDto } from '../wallet/dto/create-wallet.dto';
import { WalletService } from '../wallet/wallet.service';
import { OrderParamsDto } from '../order-items/dto/order-params.dto';
import { OrdersService } from '../orders/orders.service';
@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectModel('users') private userModel: Model<UserDocument>,
    private walletService: WalletService,
    private ordersService: OrdersService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const { referee, username } = createUserDto;
      if (referee) {
        if (username == referee) {
          throw new Error('Opps referee and username cannot match');
        }
        const ref = await this.userModel.findOne({ username: referee });
        if (!ref) {
          throw new Error(`${referee} username not found in our database`);
        }
        createUserDto.referee = <string>(<unknown>ref._id);
      } else {
        createUserDto.referee = null;
      }
      const user = await this.userModel.create(createUserDto);
      const createWalletDto = new CreateWalletDto();
      createWalletDto.user = user._id;
      createWalletDto.amount = 1000;
      this.walletService.create(createWalletDto).then((r) => true);
      createUserDto.newUser = user;
      createUserDto.status = true;
      createUserDto.token = this.generateToken(user);
    } catch (e) {
      let message = e.message;
      if (e.message.includes('users validation failed:')) {
        message = e.message.replace('users validation failed', '').split(',');
      }
      createUserDto.errorMessage = message;
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
    const data = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(data, JWT_TOKEN, {
      expiresIn: JWT_EXPIRES,
    });
    return token;
  }

  async getOrders(ordersQuery: OrderParamsDto) {
    const user = await this.request.user;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ordersQuery.user = user._id;
    return await this.ordersService.findAll(ordersQuery);
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
      await this.userModel.findByIdAndUpdate(user._id, {
        defaultAddress: shipping,
      });
      response.status = true;
    } catch (e) {
      response.message = e.message;
    }
    return response;
  }
}
