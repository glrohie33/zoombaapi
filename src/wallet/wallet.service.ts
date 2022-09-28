import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Model } from 'mongoose';
import { WalletDocument } from './entities/wallet.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('wallets') private walletModel: Model<WalletDocument>,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    try {
      const { user, walletType, amount } = createWalletDto;
      const wallet = await this.walletModel.findOneAndUpdate(
        { user, walletType },
        { walletType, user, $inc: { availableBalance: +amount } },
        {
          upsert: true,
          new: true,
        },
      );
      createWalletDto.wallet = wallet;
    } catch (e) {
      console.log(e.message);
    }
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
