import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { Params } from './dto/params';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileHelper } from '../utils/config';
@Controller('media')
export class MediaController extends BaseController {
  constructor(private readonly mediaService: MediaService) {
    super();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: uploadFileHelper('/uploads/files'),
      preservePath: true,
    }),
  )
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createMediaDto);
    let uploadedFile = null;
    let uploadStatus = false;
    try {
      uploadedFile = await this.mediaService.uploadImage(
        file,
        null,
        null,
        createMediaDto,
      );
      uploadStatus = true;
    } catch (e) {
      console.log(e.message);
    }
    return this.success(res, { uploadStatus, file: uploadedFile });
  }

  @Get()
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'currentPage', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'fileType', required: false })
  async findAll(@Query() params: Params, @Res() res: Response) {
    const files = await this.mediaService.findAll(params);
    return this.success(res, { files });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
