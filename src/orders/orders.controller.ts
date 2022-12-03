import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseController } from '../base-controller';
import { Response } from 'express';
import { OrderDocument } from './entities/order.entity';
import { rmSync } from 'fs';
import { VerifyOrderDto } from './dto/verfy-order.dto';
import { VerifyDto } from 'src/stores/dto/verify-dto';
import { ApiParam } from '@nestjs/swagger';
import { OrderParamsDto } from '../order-items/dto/order-params.dto';
import { FinanceOrderDto } from './dto/finance-order.dto';

@Controller('orders')
export class OrdersController extends BaseController {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const { status, message, order } = await this.ordersService.create(
      createOrderDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { order });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() params: OrderParamsDto) {
    const { orders, total } = await this.ordersService.findAll(params);
    return this.success(res, { total, orders });
  }

  @Get('/:id')
  async findOne(){

  }


  @Post('/verifyOrder/:id')
  @ApiParam({ name: 'id' })
  async verifyPayment(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() verifyOrderDto: VerifyOrderDto,
  ) {
    let order: VerifyOrderDto;
    verifyOrderDto.orderId = id;
    verifyOrderDto.res = res;
    const { status, message } = await this.ordersService.verifyOrder(
      verifyOrderDto,
    );

    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { status });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
