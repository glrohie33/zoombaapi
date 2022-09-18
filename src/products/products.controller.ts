import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileHelper } from '../utils/config';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { Request } from '../utils/config';
import { ProductParams } from './dto/productParams';

@Controller('products')
export class ProductsController extends BaseController {
  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images[]', 6, {
      storage: uploadFileHelper('uploads/products'),
      preservePath: true,
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    createProductDto.userDocument = req.user;
    createProductDto.user = req.user._id;
    createProductDto.uploadedFiles = files;
    const { status, message, product } = await this.productsService.create(
      createProductDto,
    );
    if (!status) {
      return this.error(res, { message: message });
    }

    return this.success(res, { product });
  }

  @Get()
  @ApiQuery({ name: 'filterBy', required: false })
  @ApiQuery({ name: 'filters', required: false })
  async findAll(@Res() res: Response, @Query() params: ProductParams) {
    const products = await this.productsService.findAll(params);
    this.success(res, { products });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.findOne(id);
    return this.success(res, { product });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
