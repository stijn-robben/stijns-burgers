import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './menuItem.schema';
import { MenuItemController } from './menuItem.controller';
import { MenuItemService } from './menuItem.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [MenuItemService],

})
export class MenuItemModule {}
