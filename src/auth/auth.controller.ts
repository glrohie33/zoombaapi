import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { COOKIE_EXPIRE, COOKIE_NAME, JWT_EXPIRES } from '../utils/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const auth = await this.authService.loginUser(loginDto);
    const { status, user, token, message } = auth;
    console.log(status, token, user);
    if (auth.status) {
      res.cookie(COOKIE_NAME, token, {
        expires: COOKIE_EXPIRE,
        httpOnly: true,
        secure: false,
      });

      return res.status(HttpStatus.OK).json({
        status,
        user,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message,
      });
    }
  }

  @Get('logout')
  logout(@Res() req: Request, @Res() res: Response) {
    res.clearCookie(COOKIE_NAME);
    return res.status(HttpStatus.OK).json({
      status: true,
      message: 'user successfully logged out',
    });
  }
}
