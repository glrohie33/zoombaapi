import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {Store} from '../entities/store.entity';
import { Dto } from '../../extensions/dto';
import { IsNotEmpty } from 'class-validator';


export class VerifyDto extends Dto {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  id: string;

  @ApiModelProperty({ type: Boolean })
  @IsNotEmpty()
  verifyStatus: boolean;

  store: Store;
}
