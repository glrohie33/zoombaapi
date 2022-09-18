import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {Attribute} from "../entities/attribute.entity";
import {Dto} from "../../extensions/dto";

export class CreateAttributeDto extends Dto{
  @ApiModelProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ type: Array, required: true })
  @IsNotEmpty()
  @IsArray()
  unit: string[];

  @ApiModelProperty({ type: Array })
  @IsArray()
  options: string[];

  status: boolean = false;
  message: string | string[];
  attribute: Attribute;
}
