import { Controller, Put, Delete } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { UpdateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { CreateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { IMenuItem, IReview } from '@herkansing-cswp/shared/api';
import { MenuItemService } from './menuItem.service';
@Controller('menu-item')
export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  @Get('')
  async getAll(): Promise<IMenuItem[]> {
    return await this.menuItemService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IMenuItem | null> {
    return await this.menuItemService.getOne(id);
  }

  @Post('')
  async create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<IMenuItem> {
    const createdMenuItem = await this.menuItemService.create(
        createMenuItemDto
    );
    return createdMenuItem;
  }

  @Put(':id')
  async update(
    @Param('id') menuItemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto) {
    const updatedMenuItem = await this.menuItemService.update(
        menuItemId,
      updateMenuItemDto
    );
    return { message: 'menu item updated successfully', menuItem: updatedMenuItem };
  }

  @Put(':id/reviews')
    async createReview(
    @Param('id') menuItemId: string,
    @Body() review: IReview
    ): Promise<IMenuItem> {
    const menuItemWithReview = await this.menuItemService.createReview(menuItemId, review);
    return menuItemWithReview;
    }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.menuItemService.delete(id);
  }

}