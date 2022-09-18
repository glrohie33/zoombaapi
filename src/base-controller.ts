import { HttpStatus, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

export class BaseController {
  success(@Res() res: Response, data: {}): any {
    return res.status(HttpStatus.OK).json({
      status: true,
      ...data,
    });
  }

  error(@Res() res: Response, data: { message: string | string[] }): any {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: false,
      ...data,
    });
  }
}
