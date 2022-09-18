import { Dto } from "src/extensions/dto";

export class CreateOrderItemDto extends Dto {
    productName:string;
    productId:string;
    price:number;
    purchasePrice:number;
    quantity:number;
    seller:string;
    total:string;
    orderId:string;
}
