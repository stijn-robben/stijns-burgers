import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "@herkansing-cswp/shared/api";
import { CreateUserDto } from "@herkansing-cswp/backend/dto";
import { RecommendationService } from "../recommendation/recommendation.service";
@Injectable()
export class AuthService {
    TAG = 'AuthService';
  constructor(private userService: UserService, private jwtService: JwtService, private recommendationService: RecommendationService) {}


  async validateUser(emailAddress: string, pass: string): Promise<Omit<IUser, 'password'>> {
    Logger.log('Validating user', this.TAG, emailAddress);
    // Use .lean() to get a plain object and then await the result
    const user = await this.userService.findOneByEmail(emailAddress).lean();
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (pass !== user.password) {
      Logger.log('Validating user password', this.TAG, pass, user.password);  
      throw new UnauthorizedException('Password incorrect');
    }
    // Since you're using .lean(), the password won't be included, but if it is, omit it here
    const { password, ...result } = user;
    return result;
  }
  
  async register(createUserDto: CreateUserDto): Promise<IUser> {
    Logger.log('Attempting to create a new user', this.TAG);
    try {

        const user = await this.userService.create(createUserDto);
        Logger.log(`User successfully created with email: ${user.emailAddress}`, this.TAG);

        return user;
    } catch (error: unknown) {
      Logger.error('Error during user registration', error instanceof Error ? error.message : String(error));
      // If it's a MongoDB error, we can log the error code as well
      if (typeof error === 'object' && error !== null && 'code' in error) {
          const errorCode = (error as { code?: number }).code;
          Logger.error(`MongoDB Error Code: ${errorCode}`);
      }
      throw new UnauthorizedException('Registration failed due to an error');
    }
  
  }


  async login(emailAddress: string, pass: string) {
    Logger.log('Attempting to log in user', this.TAG, emailAddress);

    // Verifieer de gebruiker door het e-mailadres en wachtwoord te valideren
    const user = await this.validateUser(emailAddress, pass);

    if (user) {
        // Maak een payload voor het JWT token met de nodige gebruikersinformatie
        const payload = { username: user.emailAddress, sub: user._id, role: user.role };
        
        // Teken het JWT token asynchroon
        const access_token = await this.jwtService.signAsync(payload);
        user.token = access_token;
        // Retourneer het access token en de gebruikersinformatie, exclusief het wachtwoord
        return { user };
    } else {
        throw new UnauthorizedException('Invalid credentials');
    }

  }
  
  async profile(id:string){
    Logger.log('profile of user _id: ' + id );
    return this.userService.findOne(id);
  }
}