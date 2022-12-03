import { Dto } from '../../extensions/dto';
import { RequestDocument } from '../entities/request.entity';

export class CreateRequestDto extends Dto {
  type: string;
  modelId: string;
  data: any;
  status = false;
  request: RequestDocument;
}
