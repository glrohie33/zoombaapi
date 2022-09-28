import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModel } from './entity/subscription.entity';
import { RepaymentsModule } from '../repayments/repayments.module';

@Module({
  imports: [MongooseModule.forFeature([SubscriptionModel]), RepaymentsModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
