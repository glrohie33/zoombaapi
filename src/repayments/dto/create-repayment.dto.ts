import { Dto } from '../../extensions/dto';
import { RepaymentDocument } from '../entities/repayment.entity';

export class CreateRepaymentDto extends Dto {
  amount: number;
  rate: number;
  dueDate: Date;
  datePaid: Date;
  service = 'Subscription';
  serviceId: string;
  repaymentStatus = false;
  repayment: RepaymentDocument;
}
