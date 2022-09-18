import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { PlatformService } from './platform.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileHelper } from '../utils/config';
import { Response } from 'express';
import { BaseController } from '../base-controller';

@Controller('platform')
export class PlatformController extends BaseController {
  constructor(private readonly platformService: PlatformService) {
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
    @Body() createPlatformDto: CreatePlatformDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createPlatformDto.image = file;
    const { status, platform, message } =
      await this.platformService.create(createPlatformDto);
    if (!status) {
      return this.error(res, { message: message });
    }

    return this.success(res, { platform });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const platforms = await this.platformService.findAll();
    return this.success(res, { platforms });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ) {
    return this.platformService.update(+id, updatePlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformService.remove(+id);
  }
}
