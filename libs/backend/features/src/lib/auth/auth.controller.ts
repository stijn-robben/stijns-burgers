import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@herkansing-cswp/backend/dto';
import { JwtAuthGuard } from './jwtAuth.guard';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: CreateUserDto) {
    const { emailAddress, password } = body;
    const access_token = await this.authService.login(emailAddress, password);
    return { access_token };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ description: 'User registration details', type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User has been successfully registered.', type: CreateUserDto })
  @ApiUnauthorizedResponse({ description: 'Registration failed' })
  async register(@Body() createUserDto: CreateUserDto) { 
    try {
      const user = await this.authService.register(createUserDto);
      const { ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile retrieved successfully'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  getProfile(@Req() req: any): any { 
   Logger.debug('Get user profile',req.user);
   const  user =  this.authService.profile(req.user.sub);
    return user; // Exclude password when returning the profile
  }
}