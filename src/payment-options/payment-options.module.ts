import { Module } from '@nestjs/common';
import { PaymentOptionsService } from './payment-options.service';
import { PaymentOptionsController } from './payment-options.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentOptionsModel } from './entities/payment-option.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([PaymentOptionsModel]), UsersModule],
  controllers: [PaymentOptionsController],
  providers: [PaymentOptionsService],
  exports: [MongooseModule],
})
export class PaymentOptionsModule {}
