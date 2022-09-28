import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty } from 'class-validator';
import { Platform, PlatformDocument } from '../entities/platform.entity';
import { Dto } from '../../extensions/dto';

export class CreatePlatformDto extends Dto {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ type: String, format: 'binary' })
  image: any;

  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  key: string;
  platform: PlatformDocument;
}
