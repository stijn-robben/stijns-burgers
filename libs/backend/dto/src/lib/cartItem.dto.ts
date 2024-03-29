// class validators
import { ICreateCartItem, Id } from '@herkansing-cswp/shared/api';
import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsMongoId,
    IsOptional,
  } from 'class-validator';

//models

export class CreateCartItemDto implements ICreateCartItem {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @IsMongoId()
    @IsNotEmpty()
    menuItemId!: Id;

    @IsInt()
    @IsNotEmpty()
    quantity!: number;

    @IsString()
    @IsNotEmpty()
    nameProduct!: string;

    @IsNotEmpty()
    price!: number;

    @IsString()
    @IsOptional()
    productImageUrl!: string;
    
}