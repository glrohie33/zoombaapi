import { Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlatformDocument } from './entities/platform.entity';
import * as mongoose from 'mongoose';
import { MediaService } from '../media/media.service';

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel('platforms') private platformModel: Model<PlatformDocument>,
    private mediaService: MediaService,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}
  async create(
    createPlatformDto: CreatePlatformDto,
  ): Promise<CreatePlatformDto> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      createPlatformDto.platform = await this.platformModel.create(
        createPlatformDto,
      );
      await this.uploadFile(createPlatformDto);
      createPlatformDto.status = true;
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return createPlatformDto;
  }

  async findAll() {
    let platforms: PlatformDocument[] = [];
    try {
      platforms = await this.platformModel.find();
    } catch (e) {
      console.log(e.message);
    }
    return platforms;
  }

  findOne(id: number) {
    return `This action returns a #${id} platform`;
  }

  update(id: number, updatePlatformDto: UpdatePlatformDto) {
    return `This action updates a #${id} platform`;
  }

  remove(id: number) {
    return `This action removes a #${id} platform`;
  }

  async uploadFile(createPlatformDto: CreatePlatformDto) {
    await this.mediaService.uploadImage(
      createPlatformDto.image,
      createPlatformDto.platform.id,
      'platforms',
    );
  }
}
