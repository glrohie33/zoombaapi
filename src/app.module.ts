import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModel } from './permissions/entities/permission.entity';
import { RoleModel } from './roles/entities/role.entity';
import { UserModel } from './users/entities/user.entity';
import { StoresModule } from './stores/stores.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { ProductsModule } from './products/products.module';
import { MediaModule } from './media/media.module';
import { AttributesModule } from './attributes/attributes.module';
import { BrandModel } from './brands/entities/brand.entity';
import { CategoryModel } from './categories/entities/category.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersController } from './users/users.controller';
import { StoresController } from './stores/stores.controller';
import { StoreModel } from './stores/entities/store.entity';
import { AttributesController } from './attributes/attributes.controller';
import { CartModule } from './cart/cart.module';
import { PlatformModule } from './platform/platform.module';
import { PartnersModule } from './partners/partners.module';
import { PostsModule } from './posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsController } from './products/products.controller';
import { MediaController } from './media/media.controller';
import { MetaModule } from './meta/meta.module';
import { HttpModule } from '@nestjs/axios';
import { ShippingModule } from './shipping/shipping.module';
import { ShippingController } from './shipping/shipping.controller';
import { OrdersController } from './orders/orders.controller';
import { BannersModule } from './banners/banners.module';
import { PaymentOptionsModule } from './payment-options/payment-options.module';
import { CartFactoryService } from './cart-factory/cart-factory.service';
import mongourl from './utils/mongourl';
import { CartFactory } from './cart/cartFactory';
import { SubscriptionModule } from './subscription/subscription.module';
import { RepaymentsModule } from './repayments/repayments.module';
@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(mongourl.url),
    MongooseModule.forFeature([
      PermissionModel,
      RoleModel,
      UserModel,
      BrandModel,
      CategoryModel,
      StoreModel,
    ]),
    UsersModule,
    RolesModule,
    PermissionsModule,
    StoresModule,
    BrandsModule,
    CategoriesModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    WalletModule,
    TransactionsModule,
    ProductsModule,
    MediaModule,
    AttributesModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    CartModule,
    PlatformModule,
    PartnersModule,
    PostsModule,
    ServeStaticModule.forRoot({
      rootPath: join(''),
    }),
    MetaModule,
    ShippingModule,
    BannersModule,
    PaymentOptionsModule,
    SubscriptionModule,
    RepaymentsModule,
  ],
  controllers: [AppController, CartController, AuthController],
  providers: [
    AppService,
    CartService,
    AuthService,
    CartFactoryService,
    CartFactory,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'users',
          method: RequestMethod.POST,
        },
        {
          path: 'medias',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(
        UsersController,
        StoresController,
        AttributesController,
        ProductsController,
        MediaController,
        OrdersController,
      );
  }
}
