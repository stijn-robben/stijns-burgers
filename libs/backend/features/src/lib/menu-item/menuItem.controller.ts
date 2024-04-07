import { Controller, Put, Delete, HttpStatus, HttpCode, UseGuards, Req, UnauthorizedException} from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { CreateReviewDto, UpdateMenuItemDto, UpdateReviewDto } from '@herkansing-cswp/backend/dto';
import { CreateMenuItemDto } from '@herkansing-cswp/backend/dto';
import { IMenuItem, IReview, Review } from '@herkansing-cswp/shared/api';
import { MenuItemService } from './menuItem.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { UserService } from '../user/user.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/role.decorator';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @Post(':id/reviews')
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

  return menuItem;
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an menuitem' })
  @ApiOkResponse({ description: 'The menuitem has been successfully deleted.'})

  async delete(@Param('id') id: string): Promise<void> {
    await this.menuItemService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Delete('/reviews/:reviewId/:userId')
@HttpCode(HttpStatus.NO_CONTENT)
@ApiOperation({ summary: 'Delete a review for a menu item' })
@ApiOkResponse({ description: 'The review has been successfully deleted.' })
async deleteReview(
  @Param('reviewId') reviewId: string,
  @Param('userId') userId: string,
  @Req() req: any
) {
  const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub
  const isAdmin = req.user.role === 'admin'; // Check if the user is an admin

  console.log('Deleting review with ID:', reviewId, 'for user ID:', loggedInUserId);

  if (isAdmin || loggedInUserId === userId) {
    await this.menuItemService.deleteReview(reviewId, userId);
    return { message: 'Review deleted successfully' };
  } else {
    throw new UnauthorizedException('You are not authorized to delete this review');
  }
}



@UseGuards(JwtAuthGuard)
@Get('reviews/:userId')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get reviews for a user' })
@ApiOkResponse({ description: 'The reviews have been successfully fetched.', type: [Review] })
async getReviewsByUserId(
  @Param('userId') userId: string
) {
  const reviews = await this.menuItemService.findReviewsByUserId(userId);
  return { message: 'Reviews fetched successfully', reviews };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Put('reviews/:reviewId')
@ApiOperation({ summary: 'Update a review' })
@ApiOkResponse({ description: 'The review has been successfully updated.' })
@ApiBody({ type: UpdateReviewDto })
async updateReview(
  @Param('reviewId') reviewId: string,
  @Body() updateReviewDto: UpdateReviewDto,
  @Req() req: any
) {
  const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

  const updatedReview = new Review(
    reviewId,
    updateReviewDto.score,
    updateReviewDto.description,
    loggedInUserId
  );

  return await this.menuItemService.updateReview(reviewId, updatedReview);
}}