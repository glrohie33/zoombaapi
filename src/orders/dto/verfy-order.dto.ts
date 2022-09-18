import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { IsNotEmpty } from "class-validator";
import { Dto } from "src/extensions/dto";
import { OrderDocument } from "../entities/order.entity";

export class VerifyOrderDto extends Dto{
    orderId:string;
    @ApiModelProperty({type:{}})
    data:any;
    order:OrderDocument;
}