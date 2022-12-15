import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../paymentGateway';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
import { v5 as uuid5 } from 'uuid';

@Injectable()
export class CarbonZeroServiceService implements PaymentGateway {
  generateRef(orderId: string): string {
    return uuid5('carbon_zero' + orderId, uuid5.URL);
  }

  postOrderAction(data: VerifyOrderDto) {
    data.status = true;
    return Promise.resolve(data);
  }

  verifyPayment(data: VerifyOrderDto): Promise<VerifyOrderDto> {
    data.status = true;
    return Promise.resolve(data);
  }
}
