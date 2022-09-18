import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { Request } from '../utils/config';
import { VerifyDto } from './dto/verify-dto';
import { ApiQuery } from '@nestjs/swagger';
import {BaseParams} from "../params/baseParams";

@Controller('stores')
export class StoresController extends BaseController {
  constructor(private readonly storesService: StoresService) {
    super();
  }

  @Post()
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    createStoreDto.userModel = req.user;
    createStoreDto.user = req.user._id;
    const { store, status, message } = await this.storesService.create(
      createStoreDto,
    );

    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { store });
  }

  @Get()
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'currentPage', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Res() res: Response, @Query() params: BaseParams) {
    const stores = await this.storesService.findAll(params);
    this.success(res, { stores });
  }

  @Get(':id/store')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }

  @Get('/mystore/')
  async myStore(@Req() req: Request, @Res() res: Response) {
    // console.log(req.user);
    const { user } = req;
    await user.populate('myStores');
    return this.success(res, { user });
  }

  @Post('/verify/')
  async verify(@Res() res: Response, @Body() verifyDto: VerifyDto) {
    const { status, store, message } = await this.storesService.verify(
      verifyDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { store });
  }
}
