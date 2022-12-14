import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart-dto';
import { Request } from '../utils/config';
import { Response } from 'express';
import { BaseController } from '../base-controller';
@Controller('cart')
export class CartController extends BaseController {
  constructor(private cartService: CartService) {
    super();
  }

  @Post()
  async add(
    @Body() cartDto: CartDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { status, message } = await this.cartService.create(cartDto, res);
    if (!status) {
      return this.error(res, {
        message,
      });
    }
    return this.success(res, { message: 'Item added to cart' });
  }
  @Get('clear')
  clearCart(@Res() res: Response) {
    this.cartService.clearCart(res);
    return this.success(res, { message: 'cart cleared' });
  }

  @Get(':cartType')
  async cartItems(
    @Res() res: Response,
    @Req() req: Request,
    @Param('cartType') cartType: string,
  ) {
    const cartDto = new CartDto();
    cartDto.cartType = cartType;
    try {
      const { cart } = await this.cartService.getCart(cartDto);
      return this.success(res, { cart });
    } catch (e) {
      return this.error(res, {
        message: e.message,
      });
    }
  }
}
