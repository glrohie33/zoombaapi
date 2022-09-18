import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CategoryDocument } from '../entities/category.entity';
import {Dto} from "../../extensions/dto";

export class VerifyDto extends Dto{
  @ApiModelProperty({ type: String })
  id: string;

  @ApiModelProperty({ type: Boolean })
  verfyStatus: boolean;

  category: CategoryDocument;
}
