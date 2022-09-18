import { Dto } from '../../extensions/dto';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { UserDocument } from '../../users/entities/user.entity';
import { MetaDocument } from '../entities/meta.entity';

export class CreateMetaDto extends Dto {
  constructor() {
    super();
  }

  modelDocument: string='users';
  modelId: string;
  data: any;
  dataType: string;
  metaData: MetaDocument;
}
