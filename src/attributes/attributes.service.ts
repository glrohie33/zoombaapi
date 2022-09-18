import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttributeDocument } from './entities/attribute.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel('attributes') private attributeModel: Model<AttributeDocument>,
  ) {}
  async create(
    createAttributeDto: CreateAttributeDto,
  ): Promise<CreateAttributeDto> {
    try {
      const attribute = await this.attributeModel.create(createAttributeDto);
      createAttributeDto.status = true;
      createAttributeDto.attribute = attribute;
    } catch (e) {
      createAttributeDto.status = false;
      createAttributeDto.message = [
        'there is an error creating your data for now please try again later',
      ];
    }

    return createAttributeDto;
  }

  async findAll() {
    let attributes = [];
    try {
      attributes = await this.attributeModel.find();
    } catch (e) {
      console.log(e.message);
    }

    return attributes;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribute`;
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return `This action updates a #${id} attribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }
}
