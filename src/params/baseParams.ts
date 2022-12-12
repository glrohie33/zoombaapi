import { SortOrder } from 'mongoose';
import { UserDocument } from '../users/entities/user.entity';
import { Response } from 'express';

export class BaseParams {
  sort: SortOrder = 'desc';

  perPage = 20;

  currentPage = 1;

  search = '';

  parent = '';
  userDocument: UserDocument;
  user: string;
  res: Response;
  postTypeId: string;
  all = 'false';
}
