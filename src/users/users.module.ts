import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModel} from "./entities/user.entity";
import {RoleModel} from "../roles/entities/role.entity";
import {MetaModule} from "../meta/meta.module";
import {WalletModule} from "../wallet/wallet.module";
import {OrdersModule} from "../orders/orders.module";

@Module({
  imports:[MongooseModule.forFeature([UserModel,RoleModel]),MetaModule,WalletModule,OrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[MongooseModule,UsersService]
})
export class UsersModule {}
