import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../paymentGateway';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
import { v5 as uuid5 } from 'uuid';

@Injectable()
export class ZillaServiceService implements PaymentGateway {
  generateRef(orderId: string): string {
    return uuid5('united_capital' + orderId, uuid5.URL);
  }

  postOrderAction(data: VerifyOrderDto) {}

  verifyPayment(data: VerifyOrderDto): Promise<VerifyOrderDto> {
    data.status = true;
    return Promise.resolve(data);
  }
}
