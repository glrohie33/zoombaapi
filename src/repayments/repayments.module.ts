import { Module } from '@nestjs/common';
import { RepaymentsService } from './repayments.service';
import { RepaymentsController } from './repayments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RepaymentModel } from './entities/repayment.entity';

@Module({
  imports: [MongooseModule.forFeature([RepaymentModel])],
  controllers: [RepaymentsController],
  providers: [RepaymentsService],
  exports:[RepaymentsService]
})
export class RepaymentsModule {}
