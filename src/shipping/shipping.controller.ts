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
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from '../utils/config';
import { BaseController } from '../base-controller';

@Controller('shipping')
export class ShippingController extends BaseController {
  constructor(private readonly shippingService: ShippingService) {
    super();
  }

  @Post('/price/')
  async getDeliveryPrice(
    @Body() createShippingDto: CreateShippingDto,
    @Res() res: Response,
  ) {
    const deliveryPrice = 0;
    console.log('here');
    const { status, fee } = await this.shippingService.getDeliveryPrice(
      createShippingDto,
    );
    return this.success(res, {fee});
  }

  @Get('/:type/:data?')
  @ApiParam({ name: 'type' })
  @ApiParam({ name: 'data', required: false })
  async getShippingAddress(
    @Param('type') type: string,
    @Param('data') data: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { status, shippingData } = await this.shippingService.shippingData(
      type,
      data,
      req,
    );
    return this.success(res, { shippingData });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.update(+id, updateShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingService.remove(+id);
  }
}
