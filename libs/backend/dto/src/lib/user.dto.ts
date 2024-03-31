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

export class CreateUserDto implements ICreateUser {
    @IsNotEmpty()
    @IsMongoId()
    _id!: Id;

    
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsDate()
    birthdate!: Date;

    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];

    
}

export class UpsertUserDto implements IUpsertUser {
    @IsNotEmpty()
    @IsMongoId()
    _id!: Id;

    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsDate()
    birthdate!: Date;

    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];
}

export class UpdateUserDto implements IUpdateUser {
    @IsNotEmpty()
    @IsMongoId()
    _id?: Id;

    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsDate()
    birthdate!: Date;

    @IsNotEmpty()
    @IsString()
    role!: UserRole;

    @IsNotEmpty()
    @IsString()
    postalCode!: string;

    @IsNotEmpty()
    @IsString()
    houseNumber!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    token?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    cart!: ICartItem[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Order)
    orders!: IOrder[];

    @IsArray()
    @IsMongoId({ each: true })
    reviews!: Id[];
}