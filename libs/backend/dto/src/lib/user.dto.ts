//class validators / class transformer
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
    IsEmail,
    IsMongoId,
    IsArray,
    ValidateNested,
  } from 'class-validator';
import { Type } from 'class-transformer';

//models
import { CartItem, ICartItem, ICreateUser, IOrder, IUpdateUser, IUpsertUser, Id, Order, UserRole } from '@herkansing-cswp/shared/api';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements ICreateUser {
    @IsNotEmpty()
    @IsMongoId()
    _id!: Id;

    @ApiProperty({ description: 'The first name of the user' })
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @ApiProperty({ description: 'The email address of the user' })
    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ description: 'The birthdate of the user' })
    @IsDate()
    birthdate!: Date;

    @ApiProperty({ description: 'The role of the user' })
    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @ApiProperty({ description: 'The postal code of the user' })
    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @ApiProperty({ description: 'The house number of the user' })
    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @ApiProperty({ description: 'The phone number of the user' })
    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @ApiProperty({ description: 'The cart of the user', type: [CartItem] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @ApiProperty({ description: 'The orders of the user', type: [Order] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @ApiProperty({ description: 'The reviews of the user'})
    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];

    
}

export class UpsertUserDto implements IUpsertUser {
    @IsNotEmpty()
    @IsMongoId()
    _id!: Id;

    @ApiProperty({ description: 'The first name of the user' })
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @ApiProperty({ description: 'The email address of the user' })
    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ description: 'The birthdate of the user' })
    @IsDate()
    birthdate!: Date;

    @ApiProperty({ description: 'The role of the user' })
    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @ApiProperty({ description: 'The postal code of the user' })
    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @ApiProperty({ description: 'The house number of the user' })
    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @ApiProperty({ description: 'The phone number of the user' })
    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @ApiProperty({ description: 'The cart of the user', type: [CartItem] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @ApiProperty({ description: 'The orders of the user', type: [Order] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @ApiProperty({ description: 'The reviews of the user'})
    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];

}

export class UpdateUserDto implements IUpdateUser {
    @IsNotEmpty()
    @IsMongoId()
    _id!: Id;

    @ApiProperty({ description: 'The first name of the user' })
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @ApiProperty({ description: 'The email address of the user' })
    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ description: 'The birthdate of the user' })
    @IsDate()
    birthdate!: Date;

    @ApiProperty({ description: 'The role of the user' })
    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @ApiProperty({ description: 'The postal code of the user' })
    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @ApiProperty({ description: 'The house number of the user' })
    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @ApiProperty({ description: 'The phone number of the user' })
    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @ApiProperty({ description: 'The cart of the user', type: [CartItem] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @ApiProperty({ description: 'The orders of the user', type: [Order] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @ApiProperty({ description: 'The reviews of the user'})
    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];

}