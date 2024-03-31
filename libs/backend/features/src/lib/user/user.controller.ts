import { CreateUserDto, UpdateUserDto } from "@herkansing-cswp/backend/dto";
import { IUser, Id } from "@herkansing-cswp/shared/api";
import { Controller, Get, UseGuards, Param, Req, BadRequestException, Post, Body, Put, ForbiddenException, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";
import { Roles } from "../auth/role.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UserService } from "./user.service";
import { User } from "./user.schema";


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
    
}