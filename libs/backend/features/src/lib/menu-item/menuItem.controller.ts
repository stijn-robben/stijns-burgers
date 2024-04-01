import { Controller, Put, Delete, HttpStatus, HttpCode, UseGuards, Req} from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { CreateReviewDto, UpdateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { CreateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { IMenuItem, IReview } from '@herkansing-cswp/shared/api';
import { MenuItemService } from './menuItem.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { UserService } from '../user/user.service';
@ApiTags('menu-item')

@Controller('menu-item')
export class MenuItemController {
  constructor(private menuItemService: MenuItemService, private userService: UserService) {}
  
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

  @Post(':id/review')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Add reviews to a menuitem' })
@ApiOkResponse({ description: 'The menuitem (review) has been successfully updated.' })
@ApiBody({ type: CreateReviewDto })
async createReview(
  @Param('id') menuItemId: string,
  @Body() review: IReview,
  @Req() req: any
): Promise<IMenuItem> {
  const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

  const { menuItem, review: createdReview } = await this.menuItemService.createReview(menuItemId, review, loggedInUserId);

  // Add the review ID to the user
  await this.userService.addReviewToUser(loggedInUserId, createdReview._id);

  return menuItem;
}
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an menuitem' })
  @ApiOkResponse({ description: 'The menuitem has been successfully deleted.'})

  async delete(@Param('id') id: string): Promise<void> {
    await this.menuItemService.delete(id);
  }

}