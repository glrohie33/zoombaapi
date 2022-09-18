import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
