import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors, Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { STORAGE_PATH, uploadFileHelper } from '../utils/config';
import {ApiConsumes, ApiQuery} from '@nestjs/swagger';
import { BrandDocument } from './entities/brand.entity';
import {BaseParams} from "../params/baseParams";
@Controller('brands')
export class BrandsController extends BaseController {
  constructor(private readonly brandsService: BrandsService) {
    super();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: uploadFileHelper('./public/data/uploads/brand'),
    }),
  )
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createBrandDto.uploadedFile = file;
    const { status, brand, message } = await this.brandsService.create(
      createBrandDto,
    );
    if (!status) {
      return this.error(res, { message: message });
    }

    return this.success(res, { brand });
  }

  @Get()
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'currentPage',required: false  })
  @ApiQuery({ name: 'perPage',required: false  })
  @ApiQuery({ name: 'search',required: false  })
  async findAll(@Res() res: Response, @Query() params: BaseParams) {
    const brands: BrandDocument[] = await this.brandsService.findAll(params);
    return this.success(res, { brands });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
