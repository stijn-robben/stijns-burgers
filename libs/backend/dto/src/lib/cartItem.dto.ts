// class validators
import { ICreateCartItem, IUpdateCartItem, Id } from '@herkansing-cswp/shared/api';
import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsMongoId,
    IsOptional,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

//models

export class CreateCartItemDto implements ICreateCartItem {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

   
    @ApiProperty({ description: 'The ID of the menu item' })
    @IsMongoId()
    @IsNotEmpty()
    menuItemId!: Id;

    @ApiProperty({ description: 'The quantity of the cart item' })
    @IsInt()
    @IsNotEmpty()
    quantity!: number;

    @ApiProperty({ description: 'The name of the product' })
    @IsString()
    @IsNotEmpty()
    nameProduct!: string;

    @ApiProperty({ description: 'The price of the product' })
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'The image URL of the product' })
    @IsString()
    @IsOptional()
    productImageUrl!: string;
    
}


export class UpdateCartItemDto implements IUpdateCartItem {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @ApiProperty({ description: 'The ID of the menu item' })
    @IsMongoId()
    @IsNotEmpty()
    menuItemId!: Id;

    @ApiProperty({ description: 'The quantity of the cart item' })
    @IsInt()
    @IsNotEmpty()
    quantity!: number;

    @ApiProperty({ description: 'The name of the product' })
    @IsString()
    @IsNotEmpty()
    nameProduct!: string;

    @ApiProperty({ description: 'The price of the product' })
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'The image URL of the product' })
    @IsString()
    @IsOptional()
    productImageUrl!: string;
}