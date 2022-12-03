import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestDocument } from './entities/request.entity';
import { Model } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import { Request } from '../utils/config';
import { UpdateOrderDto } from '../orders/dto/update-order.dto';
import { OrdersModule } from '../orders/orders.module';
import { OrdersService } from '../orders/orders.service';
import { VerifyOrderDto } from '../orders/dto/verfy-order.dto';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectModel('requests') private requestModel: Model<RequestDocument>,
    private logger: Logger,
    private orderService: OrdersService,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<CreateRequestDto> {
    try {
      createRequestDto.user = this.req.user.id;
      const request = await this.requestModel.create(createRequestDto);
      if (request) {
        createRequestDto.request = request;
      }

      createRequestDto.status = true;
    } catch (e) {
      this.logger.error(e.message);
      createRequestDto.message = 'sorry request could not be created';
    }
    return createRequestDto;
  }

  findAll() {
    return this.requestModel.find();
  }

  findOne(id: string) {
    return this.requestModel.findById(id);
  }

  async update(id, updateRequestDto: UpdateRequestDto) {
    try {
      updateRequestDto.approvedBy = this.req.user.id;
      const request = await this.requestModel.findByIdAndUpdate(
        id,
        updateRequestDto,
        { new: true },
      );

      //update order status to complete if the request is approved
      if (request.type == 'orders' && request.status == true) {
        this.updateOrder(request.modelId);
      }
      updateRequestDto.status = true;
    } catch (e) {
      updateRequestDto.message = e.message;
      Logger.error(e.message);
    }

    return updateRequestDto;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }

  updateOrder(orderId) {
    const orderDto = new VerifyOrderDto();
    orderDto.orderId = orderId;
    this.orderService.verifyOrder(orderDto).then((res) => true);
  }
}
