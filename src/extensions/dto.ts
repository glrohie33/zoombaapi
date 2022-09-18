import { UserDocument } from '../users/entities/user.entity';
import { Response } from 'express';

export class Dto {
  status = false;
  message: string | string[];
  userDocument: UserDocument;
  user: string;
  res: Response;
  search: string;
}
