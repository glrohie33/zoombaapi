import { Dto } from '../../extensions/dto';
import { WalletDocument } from '../entities/wallet.entity';
import * as mongoose from 'mongoose';

export class CreateWalletDto {
  user:  string;
  amount: number;
  walletType = 1;
  wallet: WalletDocument;
}
