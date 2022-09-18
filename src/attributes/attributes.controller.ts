import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { AttributeDocument } from './entities/attribute.entity';

@Controller('attributes')
export class AttributesController extends BaseController {
  constructor(private readonly attributesService: AttributesService) {
    super();
  }

  @Post()
  async create(
    @Body() createAttributeDto: CreateAttributeDto,
    @Res() res: Response,
  ) {
    const { status, message, attribute } = await this.attributesService.create(
      createAttributeDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, {
      attribute,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const attributes: AttributeDocument[] =
      await this.attributesService.findAll();
    return this.success(res, { attributes });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributesService.update(+id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(+id);
  }
}
