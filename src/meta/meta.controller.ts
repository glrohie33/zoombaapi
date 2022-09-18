import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { MetaService } from './meta.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Request } from '../utils/config';
import { Response } from 'express';
import { BaseController } from '../base-controller';

@Controller('meta')
export class MetaController extends BaseController {
  constructor(private readonly metaService: MetaService) {
    super();
  }

  @Post()
  async create(
    @Body() createMetaDto: CreateMetaDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { message, status, metaData } = await this.metaService.create(
      createMetaDto,
    );
    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { metaData });
  }

  @Get()
  findAll(@Res() res) {
    return this.metaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetaDto: UpdateMetaDto) {
    return this.metaService.update(+id, updateMetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaService.remove(+id);
  }
}
