import { Injectable } from '@nestjs/common';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
import { PaymentGateway } from '../paymentGateway';
import { v5 as uuid5 } from 'uuid';
import { RequestsService } from '../../requests/requests.service';
import { CreateRequestDto } from '../../requests/dto/create-request.dto';

@Injectable()
export class UnitedCapitalService implements PaymentGateway {
  generateRef(orderId: string): string {
    return uuid5('united_capital' + orderId, uuid5.URL);
  }

  async verifyPayment(data: VerifyOrderDto): Promise<VerifyOrderDto> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const requests = VerifyOrderDto.requests;
    const request = requests[0];
    if (requests.length > 0 && request.status) {
      data.status = true;
    }

    return Promise.resolve(data);
  }

  postOrderAction(data: VerifyOrderDto) {}
}
