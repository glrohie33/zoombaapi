import { RaveService } from './rave/rave.service';
import { Injectable } from '@nestjs/common';
import { PaymentGateway } from './paymentGateway';
import { UnitedCapitalService } from './united-capital/united-capital.service';
import { CarbonZeroServiceService } from './carbon-zero-service/carbon-zero-service.service';
import { ZillaServiceService } from './zilla-service/zilla-service.service';

@Injectable()
export class GatewayFactory {
  constructor(
    public rave: RaveService,
    public ucap: UnitedCapitalService,
    public carbon: CarbonZeroServiceService,
    public zilla: ZillaServiceService,
  ) {}

  getInstance(name): PaymentGateway {
    if (name in this) {
      return this[name];
    }
    throw new Error('payment gateway does not exist');
  }
}
