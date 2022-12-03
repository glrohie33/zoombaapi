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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';

@Controller('requests')
export class RequestsController extends BaseController {
  constructor(private readonly requestsService: RequestsService) {
    super();
  }

  @Post()
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Res() res: Response,
  ) {
    const { status, request, message } = await this.requestsService.create(
      createRequestDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { request, status });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const requests = await this.requestsService.findAll();
    return this.success(res, { requests });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    const { status, message } = await this.requestsService.update(
      id,
      updateRequestDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { message: 'request successfuly updated' });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
