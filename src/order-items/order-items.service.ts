import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemDocument } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel('orderItems') private orderItemModel: Model<OrderItemDocument>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    let order: OrderItemDocument;
    const { orderId, productId } = createOrderItemDto;
    try {
      order = await this.orderItemModel.findOneAndUpdate(
        { orderId, productId },
        createOrderItemDto,
        {
          upsert: true,
          new: true,
        },
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  findAll() {
    return `This action returns all orderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
