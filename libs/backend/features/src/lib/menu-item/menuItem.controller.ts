import { Controller, Put, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { UpdateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { CreateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { IMenuItem, IReview } from '@herkansing-cswp/shared/api';
import { MenuItemService } from './menuItem.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('menu-item')

@Controller('menu-item')
export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all menuitems'})
  @ApiOkResponse({ description: 'Returned all menuitems.' })
  @ApiNotFoundResponse({ description: 'Menuitems not found.' })
  async getAll(): Promise<IMenuItem[]> {
    return await this.menuItemService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menuitem by id' })
  @ApiOkResponse({ description: 'Returned single menuitem.' })
  @ApiNotFoundResponse({ description: 'Menuitem not found.' })
  async getOne(@Param('id') id: string): Promise<IMenuItem | null> {
    return await this.menuItemService.getOne(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new menuitem' })
  @ApiBody({ type: CreateMenuItemDto })
  @ApiCreatedResponse({ description: 'The course has been successfully created.'})
  async create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<IMenuItem> {
    const createdMenuItem = await this.menuItemService.create(
        createMenuItemDto
    );
    return createdMenuItem;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menuitem' })
  @ApiOkResponse({ description: 'The menuitem has been successfully updated.' })
  @ApiBody({ type: UpdateMenuItemDto })

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
  @ApiOperation({ summary: 'Update reviews in a menuitem' })
  @ApiOkResponse({ description: 'The menuitem (review) has been successfully updated.' })
  @ApiBody({ type: UpdateMenuItemDto })

    async createReview(
    @Param('id') menuItemId: string,
    @Body() review: IReview
    ): Promise<IMenuItem> {
    const menuItemWithReview = await this.menuItemService.createReview(menuItemId, review);
    return menuItemWithReview;
    }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an menuitem' })
  @ApiOkResponse({ description: 'The menuitem has been successfully deleted.'})

  async delete(@Param('id') id: string): Promise<void> {
    await this.menuItemService.delete(id);
  }

}