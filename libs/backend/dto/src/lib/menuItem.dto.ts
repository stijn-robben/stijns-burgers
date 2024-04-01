// class validators
import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsMongoId,
    IsOptional,
    IsArray,
    ValidateNested,
  } from 'class-validator';

//models
import { ICreateMenuItem, IReview, IUpdateMenuItem, IUpsertMenuItem, Id, Review } from "@herkansing-cswp/shared/api";
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto implements ICreateMenuItem {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @ApiProperty({ description: 'The type of the menu item' })
    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @ApiProperty({ description: 'The description of the menu item' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ description: 'The name of the menu item' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'The price of the menu item' })
    @IsInt()
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'The ingredients of the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @ApiProperty({ description: 'The allergens in the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @ApiProperty({ description: 'The image URL of the menu item' })
    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @ApiProperty({ description: 'The reviews of the menu item', type: [Review] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}
  
export class UpsertMenuItemDto implements IUpsertMenuItem {
    @IsMongoId()
    @IsOptional()
    _id!: Id;


    @ApiProperty({ description: 'The type of the menu item' })
    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @ApiProperty({ description: 'The description of the menu item' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ description: 'The name of the menu item' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'The price of the menu item' })
    @IsInt()
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'The ingredients of the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @ApiProperty({ description: 'The allergens in the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @ApiProperty({ description: 'The image URL of the menu item' })
    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @ApiProperty({ description: 'The reviews of the menu item', type: [Review] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}

export class UpdateMenuItemDto implements IUpdateMenuItem {
    @IsMongoId()
    _id?: Id;

    @ApiProperty({ description: 'The type of the menu item' })
    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @ApiProperty({ description: 'The description of the menu item' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ description: 'The name of the menu item' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'The price of the menu item' })
    @IsInt()
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'The ingredients of the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @ApiProperty({ description: 'The allergens in the menu item'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @ApiProperty({ description: 'The image URL of the menu item' })
    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @ApiProperty({ description: 'The reviews of the menu item', type: [Review] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}