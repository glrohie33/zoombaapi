import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from './utils/config';
import { Response } from 'express';
import { BaseController } from './base-controller';
import { ApiParam } from '@nestjs/swagger';
import { BaseParams } from './params/baseParams';
@Controller()
export class AppController extends BaseController {
  constructor(private readonly appService: AppService) {
    super();
  }

  @Get()
  async getHello(@Req() req: Request, @Res() res: Response) {
    const slug = 'home-page';
    let data: any = {};
    data = await this.appService.getPost(slug);
    data.view = 'homepage';
    return res.status(200).json(data);
  }

  @Get('/page/')
  async page(
    @Req() req: Request,
    @Res() res: Response,
    @Query() urlQuery: BaseParams,
  ) {
    const slug = 'home-page';
    let data: any = {};
    data = await this.appService.getPost(slug);
    data.view = 'home';
    return res.status(200).json(data);
  }

  @Get('/page/:slug')
  async pageView(@Param('slug') slug: string, @Res() res: Response) {
    let post: any = {};
    post = await this.appService.getPost(slug);
    return res.status(200).json(post);
  }

}
