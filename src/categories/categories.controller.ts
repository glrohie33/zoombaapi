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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { uploadFileHelper } from '../utils/config';
import { CategoryParams } from './dto/categoryParams';
@Controller('categories')
export class CategoriesController extends BaseController {
  constructor(private readonly categoriesService: CategoriesService) {
    super();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: uploadFileHelper('./public/data/uploads/category'),
      preservePath: true,
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createCategoryDto.uploadedFile = file;
    const { status, category, message } = await this.categoriesService.create(
      createCategoryDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { category });
  }

  @Get()
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'currentPage', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'parent', required: false })
  async findAll(@Res() res: Response, @Query() params: CategoryParams) {
    const { categories, total } = await this.categoriesService.findAll(params);
    return this.success(res, { categories, total });
  }

  @Get('topcategories')
  async topCategories(@Res() res: Response) {
    let categories: any = [];
    categories = await this.categoriesService.getTopCategories();
    return this.success(res, { categories });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const category = await this.categoriesService.findOne(id);
    this.success(res, { category });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    let category: any = [];
    try {
      category = await this.categoriesService.update(id, updateCategoryDto);
      if (!category) {
        throw new Error('category not found');
      }
      return this.success(res, { category });
    } catch ({ message }) {
      return this.error(res, { message });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
