import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../paymentGateway';
import { VerifyOrderDto } from '../dto/verfy-order.dto';

@Injectable()
export class ZillaServiceService implements PaymentGateway {
  generateRef(orderId: string): string {
    return '';
  }

  postOrderAction(data: VerifyOrderDto) {}

  verifyPayment(data: VerifyOrderDto): Promise<VerifyOrderDto> {
    data.status = true;
    return Promise.resolve(data);
  }
}
