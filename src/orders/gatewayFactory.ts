import { RaveService } from './rave/rave.service';
import {Injectable} from "@nestjs/common";
import {PaymentGateway} from "./paymentGateway";

@Injectable()
export class GatewayFactory {
  private rave: PaymentGateway;
  constructor() {
    this.rave = new RaveService();
  }

  getInstance(name): PaymentGateway {
    if (name in this) {
      return this[name];
    }
    throw new Error('payment gateway does not exist');
  }
}
