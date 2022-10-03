import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { COOKIE_NAME, JWT_TOKEN } from '../utils/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UsersService,
    @InjectModel('users') private userModel: Model<UserDocument>,
  ) {}
  async use(req: any, res: any, next: () => void) {
    const token = req.cookies[COOKIE_NAME];
    console.log(token);
    // const token = req.header.zoombaToken;
    const errCode = HttpStatus.UNAUTHORIZED;
    if (!token) {
      return res.status(errCode).json({
        code: errCode,
        message: 'unauthorizedUser',
      });
    }
    let isValid: any = false;
    let userData: any;
    try {
      isValid = jwt.verify(token, JWT_TOKEN);
    } catch (e) {}
    if (!isValid) {
      return res.status(errCode).json({
        code: errCode,
        message: 'unauthorized User',
      });
    }

    const user = await this.userModel.findById(isValid.id);
    req.user = user;
    if (!user) {
      return res.status(errCode).json({
        code: errCode,
        message: 'unauthorized User',
      });
    }

    req.user = user;
    // req.body.user = user;

    next();
  }
}
