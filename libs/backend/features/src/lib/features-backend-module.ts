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
import { RecommendationController } from "./recommendation/recommendation.controller";
import { RecommendationService } from "./recommendation/recommendation.service";
import { Neo4jModule, Neo4jScheme } from "nest-neo4j/dist";
import { environment } from "@herkansing-cswp/shared/util-env";
@Module({

    imports: [
      Neo4jModule.forRoot({
        scheme: environment.neo4j.schema as Neo4jScheme,
        host: environment.neo4j.host,
        port: environment.neo4j.password,
        username: environment.neo4j.username,
        password: environment.neo4j.password,
      }),
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
      RecommendationController,
      UserController,
      AuthController,
      MenuItemController,
    ],
    providers: [UserService, AuthService, MenuItemService, RecommendationService],
    exports: [UserService, AuthService, MenuItemService, RecommendationService],
  })
  export class FeaturesBackendModule {}