import { VerifyOrderDto } from "./dto/verfy-order.dto";

export interface PaymentGateway {
  generateRef(orderId:string): string;
  verifyPayment(data: VerifyOrderDto): Promise<VerifyOrderDto>;
}
