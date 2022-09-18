import { Injectable } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetaDocument } from './entities/meta.entity';

@Injectable()
export class MetaService {
  constructor(@InjectModel('metas') private metaModel: Model<MetaDocument>) {}

  async create(createMetaDto: CreateMetaDto): Promise<CreateMetaDto> {
    try {
      const meta = await this.metaModel.create(createMetaDto);
      createMetaDto.status = true;
      createMetaDto.metaData = meta;
    } catch (e) {
      console.log(e.message);
      createMetaDto.message =
        'Cannot create data at the moment please try again later';
    }
    return createMetaDto;
  }

  findAll() {
    return `This action returns all meta`;
  }

  async findOne(id: string):Promise<MetaDocument>{
    return await this.metaModel.findById(id);
  }

  update(id: number, updateMetaDto: UpdateMetaDto) {
    return `This action updates a #${id} meta`;
  }

  remove(id: number) {
    return `This action removes a #${id} meta`;
  }
}
