import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { COOKIE_EXPIRE } from '../utils/config';
import { BaseController } from '../base-controller';
import { Params } from './dto/params';
import { Request } from '../utils/config';
import { User } from './entities/user.entity';
import { UserdataDto } from './dto/userdataDto';
import { MetaService } from '../meta/meta.service';
import { CreateMetaDto } from '../meta/dto/create-meta.dto';

@Controller('users')
export class UsersController extends BaseController {
  constructor(
    private readonly usersService: UsersService,
    private readonly metaService: MetaService,
  ) {
    super();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const Insert = await this.usersService.create(createUserDto);

    if (Insert.status) {
      res.cookie('zoombaUserToken', Insert.token, {
        expires: COOKIE_EXPIRE,
        httpOnly: true,
      });
      return res.status(HttpStatus.OK).json({
        status: true,
        user: Insert.newUser,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: createUserDto.errorMessage,
        errorCode: 'Bad Request',
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const user = await this.usersService.findAll();
    return this.success(res, { user });
  }

  @Get('profile')
  async profile(@Res() res: Response) {
    const user = await this.usersService.getProfile();
    return this.success(res, { user });
  }

  @Get('orders')
  async orders(@Res() res: Response) {
    const orders = await this.usersService.getOrders();
    return this.success(res, { orders });
  }

  @Post('setDefaultShipping')
  async setDefaultShipping(
    @Res() res: Response,
    @Body('shippingId') shippingId: string,
  ) {
    const { status, message } = await this.usersService.setDefaultShipping(
      shippingId,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { message: 'Shipping address updated' });
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const { status, user, message } = await this.usersService.findOne(id);
    if (!status) {
      return this.error(res, { message });
    }
    return this.success(res, { user });
  }

  @Get('metadata/:type')
  async getUserMeta(
    @Query() param: Params,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    let userData: any = [];
    console.log(req.user);
    if (req.user) {
      const userModel = req.user;
      const match: any = {};
      if (param.metaType) {
        match.metaType = param.metaType;
      }
      await userModel.populate({ path: 'metaData', match });
      userData = <User>userModel.toJSON();
    }
    return this.success(res, { userData });
  }

  @Post('metadata/:type')
  async setUserMeta(
    @Param('type') type: string,
    @Res() res: Response,
    @Req() req: Request,
    @Body() userdataDto: UserdataDto,
  ) {
    const metaDto = new CreateMetaDto();
    metaDto.modelId = req.user.id;
    metaDto.data = userdataDto.data;
    metaDto.dataType = type;
    metaDto.modelDocument = 'users';
    const { status, metaData, message } = await this.metaService.create(
      metaDto,
    );
    if (!status) {
      return this.error(res, { message });
    }

    return this.success(res, { metaData });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
