import { CartDto } from '../../cart/dto/cart-dto';
import { ProductDocument } from '../../products/entities/product.entity';
import { Dto } from '../../extensions/dto';
import { OrderDocument } from '../entities/order.entity';
import {IsNotEmpty} from "class-validator";

export class CreateOrderDto extends Dto {
  constructor() {
    super();
  }
  @IsNotEmpty()
  shippingAddressId: any;
  @IsNotEmpty()
  paymentGateway: string;
  @IsNotEmpty()
  cartType: string;
  @IsNotEmpty()
  platformId: string;

  paymentRef: string;
  cart: CartDto;
  totalPrice:number;

  shippingAddress: {
    firstname: string;
    lastname: string;
    state: string;
    city: string;
    address: string;
    phoneNumber: string;
    additionalPhoneNumber?: string;
    town?: string;
    cityCode?: string;
    townCode?: string;
  };
  shippingPrice: number;
  grandTotal: number;
  vat: number;
  orderItems: ProductDocument[];
  order: OrderDocument;
  user:string;
}
