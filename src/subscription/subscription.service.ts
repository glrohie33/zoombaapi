import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionDocument } from './entity/subscription.entity';
import { Model } from 'mongoose';
import { RepaymentsService } from '../repayments/repayments.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel('subscriptions')
    private subscriptionModel: Model<SubscriptionDocument>,
    private repaymentsService: RepaymentsService,
  ) {}
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const { serviceId, service } = createSubscriptionDto;
      const subscription = await this.subscriptionModel.findOneAndUpdate(
        { serviceId, service },
        createSubscriptionDto,
        { upsert: true, new: true },
      );
      console.log(subscription);
      createSubscriptionDto.status = true;
      createSubscriptionDto.subscription = subscription;
    } catch (e) {
      createSubscriptionDto.message = e.message;
    }
    return createSubscriptionDto;
  }
}
