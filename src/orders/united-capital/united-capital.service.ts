import { Injectable, Logger } from '@nestjs/common';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
import { PaymentGateway } from '../paymentGateway';
import { v5 as uuid5 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentOptionDocument } from '../../payment-options/entities/payment-option.entity';

@Injectable()
export class UnitedCapitalService implements PaymentGateway {
  constructor(
    private logger: Logger,
    private mailService: MailerService,
    @InjectModel('paymentOptions')
    private paymentOptions: Model<PaymentOptionDocument>,
  ) {}
  generateRef(orderId: string): string {
    return uuid5('united_capital' + orderId, uuid5.URL);
  }

  async verifyPayment(verifyOrderDto: VerifyOrderDto): Promise<VerifyOrderDto> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const requests = verifyOrderDto.order.requests;
    console.log(verifyOrderDto.order);
    const request = requests[0];

    if (requests.length > 0 && request.status) {
      if (!request.approvedBy) {
        verifyOrderDto.status = false;
        await this.sendRequestMail();
      } else {
        if (request.status) {
          verifyOrderDto.status = true;
        }
      }
    }

    return Promise.resolve(verifyOrderDto);
  }

  async sendRequestMail() {
    try {
      const { admin }: PaymentOptionDocument = await this.paymentOptions
        .findOne({ key: 'ucap' })
        .populate('admin');

      await this.mailService.sendMail({
        to: admin.email,
        subject: 'Order Request In',
        template: './requests/newRequest',
        context: {
          admin: admin.email,
        },
      });
    } catch (e) {
      this.logger.log(e.message);
    }
  }

  postOrderAction(data: VerifyOrderDto) {}
}
