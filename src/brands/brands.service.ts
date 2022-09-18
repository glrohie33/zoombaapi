import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandDocument } from './entities/brand.entity';
import { MediaService } from '../media/media.service';
import mongoose from 'mongoose';
import { BaseParams } from '../params/baseParams';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel('brands') private brandModel: Model<BrandDocument>,
    private mediaService: MediaService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<CreateBrandDto> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      const brand = await this.brandModel.create(createBrandDto);
      const file = await this.mediaService.uploadImage(
        createBrandDto.uploadedFile,
        brand.id,
        'brands',
      );
      brand.image = file._id;
      brand.save();
      createBrandDto.status = true;
      createBrandDto.brand = brand;
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.log(e.message);
      createBrandDto.message =
        'there is an error creating category please try again later';
    } finally {
      await session.endSession();
    }
    return createBrandDto;
  }

  async findAll(params: BaseParams) {
    const { perPage, currentPage, search } = params;
    let brands = [];
    try {
      brands = await this.brandModel
        .find()
        .regex('name', search)
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } catch (e) {
      console.log(e.message);
    }
    return brands;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
