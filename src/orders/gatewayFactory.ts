import { RaveService } from './rave/rave.service';
import { Injectable } from '@nestjs/common';
import { PaymentGateway } from './paymentGateway';
import { UnitedCapitalService } from './united-capital/united-capital.service';

@Injectable()
export class GatewayFactory {
  constructor(public rave: RaveService, public up: UnitedCapitalService) {}

  getInstance(name): PaymentGateway {
    if (name in this) {
      return this[name];
    }
    throw new Error('payment gateway does not exist');
  }
}
