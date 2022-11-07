import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.entity';
import { Model } from 'mongoose';
import { VerifyDto } from './dto/verify-dto';
import * as mongoose from 'mongoose';
import { BaseParams } from '../params/baseParams';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('stores') private storeModel: Model<Store>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<CreateStoreDto> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      const store = await this.storeModel.create(createStoreDto);
      await store.populate('user', ['firstname', 'lastname', 'email']);
      if (createStoreDto.userModel.role == 'user') {
        createStoreDto.userModel.role = 'vendor';
        await createStoreDto.userModel.update({ $set: { role: 'vendor' } });
      }
      createStoreDto.store = store;
      createStoreDto.status = true;
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.log(e.message);
      createStoreDto.message = ['there is an error creating store'];
    } finally {
      await session.endSession();
    }
    return createStoreDto;
  }

  async findAll(params: BaseParams) {
    const { perPage, currentPage, search } = params;
    return this.storeModel
      .find()
      .regex('name', search)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async verify(verifyDto: VerifyDto): Promise<VerifyDto> {
    const store = await this.storeModel.findById(verifyDto.id);

    if (!store) {
      verifyDto.message = ['store does not exist'];
    }

    store.verified = verifyDto.verifyStatus;
    store.save();
    verifyDto.status = true;
    verifyDto.store = store;
    return verifyDto;
  }
}
