import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema, User, UserSchema } from "./user/user.schema";
import { MenuItem, MenuItemSchema, ReviewSchema } from "./menu-item/menuItem.schema";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { MenuItemController } from "./menu-item/menuItem.controller";
import { MenuItemService } from "./menu-item/menuItem.service";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { Order, Review } from "@herkansing-cswp/shared/api";
import { environment } from "@herkansing-cswp/shared/util-env";
@Module({

    imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '60m' },
      }), MongooseModule.forFeature([
        {name: User.name, schema: UserSchema },
        {name: MenuItem.name, schema: MenuItemSchema },
        {name: Review.name, schema: ReviewSchema },
        {name: Order.name, schema: OrderSchema}
    ])
    ],
    controllers: [
      UserController,
      AuthController,
      MenuItemController,
    ],
    providers: [UserService, AuthService, MenuItemService],
    exports: [UserService, AuthService, MenuItemService],
  })
  export class FeaturesBackendModule {}