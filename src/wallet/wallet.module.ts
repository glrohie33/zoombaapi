import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModel } from './entities/wallet.entity';

@Module({
  imports: [MongooseModule.forFeature([WalletModel])],
  controllers: [WalletController],
  providers: [WalletService],
  exports:[WalletService]
})
export class WalletModule {}
