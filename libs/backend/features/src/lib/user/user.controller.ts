import { CreateCartItemDto, CreateOrderDto, CreateUserDto, UpdateCartItemDto, UpdateUserDto } from "@herkansing-cswp/backend/dto";
import { ICartItem, IOrder, IUpdateOrder, IUser, Id, Order, Status } from "@herkansing-cswp/shared/api";
import { Controller, Get, UseGuards, Param, Req, BadRequestException, Post, Body, Put, ForbiddenException, Delete, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";
import { Roles } from "../auth/role.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UserService } from "./user.service";
import { CartItem, User } from "./user.schema";


@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
   async getAll(): Promise<IUser[]> {
        return await this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiOkResponse({ description: 'Successfully retrieved user', type: User })
    @ApiBadRequestResponse({ description: 'Invalid user ID' })
    @ApiNotFoundResponse({ description: 'User not found' })
   async getOne(@Param('id') id: Id, @Req() req:any): Promise<IUser | null>  {
        const requester = req.user;
    
        if ((!id)) {
          throw new BadRequestException('Invalid user ID');
        }
        
        if (requester.role !== 'admin' && requester.sub !== id) {
          throw new BadRequestException('Unauthorized access');
        }
    
        return  this.userService.findOne(id);
      }
    
    @Post('')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiCreatedResponse({ description: 'The user has been successfully created.', type: User })
    @ApiBadRequestResponse({ description: 'Bad request. Invalid data.' })
    @ApiBody({ type: CreateUserDto })
    create(@Body() data: CreateUserDto):Promise<IUser> {
        return this.userService.create(data);
    }

    @Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiOperation({ summary: 'Update an existing user' })
@ApiOkResponse({ description: 'The user has been successfully updated.', type: User })
@ApiBadRequestResponse({ description: 'Bad request. Invalid user ID or data.' })
@ApiBody({ type: UpdateUserDto })
async update(@Param('id') id: string, @Body() data: UpdateUserDto, @Req() req: any): Promise<IUser | null> {
    const requester = req.user;
    const isAdmin = requester.role === 'admin';


    if (!isAdmin && requester.sub !== id) {
        throw new ForbiddenException('Je bent niet gemachtigd om deze actie uit te voeren.');
    }

    return this.userService.update(id, data);
}

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiOkResponse({ description: 'Successfully deleted user' })
    @ApiBadRequestResponse({ description: 'Invalid user ID' })
    deleteUser(@Param('id') id: Id, @Req() req:any): any {
        const requester = req.user;
        const loggedInUserId = req.user._id;
        const isAdmin = req.user.role == 'admin';
    
        if (!(id)) {
          throw new BadRequestException('Invalid user ID');
        }
         if (id !== loggedInUserId && !isAdmin) {
          throw new ForbiddenException('Unauthorized access');
        }
        if (requester.role !== 'admin' && requester.sub !== id) {
          throw new BadRequestException('Unauthorized access');
        }
       return this.userService.delete(id);
    }

    @Post('/cart')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Add a cart item to a user' })
    @ApiOkResponse({ description: 'The cart item has been successfully added.' })
    @ApiBody({ type: CreateCartItemDto })
    async addToCart(
      @Body() cartItem: ICartItem,
      @Req() req: any
    ): Promise<IUser> {
      const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub


      return this.userService.addToCart(loggedInUserId, cartItem);
    }
    
    @Delete(':userId/cart/:cartItemId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Remove a cart item from a user' })
    @ApiOkResponse({ description: 'The cart item has been successfully removed.' })
    async removeFromCart(
      @Param('userId') userId: string,
      @Param('cartItemId') cartItemId: string,
      @Req() req: any
    ): Promise<{ deleted: boolean; message?: string }> {
      const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

      // Check if the logged in user is the same as the user we're trying to remove a cart item from
      if (loggedInUserId !== userId) {
        throw new UnauthorizedException();
      }

      return this.userService.removeFromCart(userId, cartItemId);
    }

    @Put(':userId/cart/:cartItemId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a cart item in a user\'s cart' })
    @ApiOkResponse({ description: 'The cart item has been successfully updated.' })
    @ApiBody({ type: UpdateCartItemDto })
    async updateCartItem(
      @Param('userId') userId: string,
      @Param('cartItemId') cartItemId: string,
      @Body('quantity') quantity: number,
      @Req() req: any
    ): Promise<IUser> {
      const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

      // Check if the logged in user is the same as the user we're trying to update a cart item for
      if (loggedInUserId !== userId) {
        throw new UnauthorizedException();
      }

      return this.userService.updateCartItem(userId, cartItemId, quantity);
    }

    @Get(':id/cart')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get the cart items from a user\'s cart' })
    @ApiOkResponse({ description: 'The cart items have been successfully retrieved.', type: [CartItem] })
    async getCartItems(
      @Param('id') userId: string,
      @Req() req: any
    ): Promise<ICartItem[]> {
      const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

      // Check if the logged in user is the same as the user we're trying to get the cart items from
      if (loggedInUserId !== userId) {
        throw new UnauthorizedException();
      }

      return this.userService.getCartItems(userId);
    }

    @Delete(':id/cart')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Delete all cart items from a user\'s cart' })
@ApiOkResponse({ description: 'The cart items have been successfully deleted.' })
async deleteCartItems(
  @Param('id') userId: string,
  @Req() req: any
): Promise<void> {
  const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

  // Check if the logged in user is the same as the user we're trying to delete the cart items for
  if (loggedInUserId !== userId) {
    throw new UnauthorizedException();
  }

  return this.userService.deleteCartItems(userId);
}

// @Post(':id/order')
// @UseGuards(JwtAuthGuard)
// @ApiOperation({ summary: 'Create a new order and clear the cart' })
// @ApiCreatedResponse({ description: 'The order has been successfully created.', type: Order })
// @ApiBadRequestResponse({ description: 'Bad request. Invalid data.' })
// @ApiBody({ type: CreateOrderDto })
// async createOrderAndClearCart(
//   @Param('id') userId: string,
//   @Req() req: any,
//   @Body() data: CreateOrderDto
// ): Promise<{ user: IUser, order: IOrder }> {
//   const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

//   // Check if the logged in user is the same as the user we're trying to create the order for
//   if (loggedInUserId !== userId) {
//     throw new UnauthorizedException();
//   }

//   await this.userService.deleteCartItems(userId);
//   return this.userService.createOrder(userId, data, loggedInUserId);
// }

@Post(':id/order')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Create a new order and clear the cart' })
@ApiCreatedResponse({ description: 'The order has been successfully created.', type: Order })
@ApiBadRequestResponse({ description: 'Bad request. Invalid data.' })
@ApiBody({ type: CreateOrderDto })
async createOrderAndClearCart(
  @Param('id') userId: string,
  @Req() req: any
): Promise<{ user: IUser, order: IOrder }> {
  const loggedInUserId = req.user.sub; // Get the user ID from req.user.sub

  // Check if the logged in user is the same as the user we're trying to create the order for
  if (loggedInUserId !== userId) {
    throw new UnauthorizedException();
  }

  // Fetch the user and their cart
  const user = await this.userService.findOne(userId);

  // Check if user is not null
  if (!user) {
    throw new NotFoundException(`User with id ${userId} not found`);
  }

  const cart = user.cart;

  // Create the orderDto with all required properties
  const orderDto: CreateOrderDto = {
    _id_user: userId,
    order_date: new Date(),
    status: Status.pending, // or any other default status
    total_amount: cart.reduce((sum, item) => sum + item.price, 0), // calculate total amount
    est_delivery_time: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
    cart: cart
  };

  // Create the order with the orderDto
  const order = await this.userService.createOrder(userId, orderDto, loggedInUserId);

  // Clear the user's cart
  await this.userService.deleteCartItems(userId);

  return order;
}

@Get(':id/name')
@ApiOperation({ summary: 'Get user name by ID' })
@ApiOkResponse({ description: 'Successfully retrieved user name' })
@ApiBadRequestResponse({ description: 'Invalid user ID' })
@ApiNotFoundResponse({ description: 'User not found' })
async getName(@Param('id') id: Id, @Req() req:any): Promise<string | null> {
    const requester = req.user;

    if ((!id)) {
      throw new BadRequestException('Invalid user ID');
    }


    const name = await this.userService.findNameById(id);
    if (!name) {
      throw new NotFoundException('User not found');
    }

    return name;
}

}