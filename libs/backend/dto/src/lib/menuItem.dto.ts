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

export class CreateMenuItemDto implements ICreateMenuItem {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsInt()
    @IsNotEmpty()
    price!: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}
  
export class UpsertMenuItemDto implements IUpsertMenuItem {
    @IsMongoId()
    @IsOptional()
    _id!: Id;

    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsInt()
    @IsNotEmpty()
    price!: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}

export class UpdateMenuItemDto implements IUpdateMenuItem {
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsInt()
    @IsNotEmpty()
    price!: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ingredients!: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    allergens!: string[];

    @IsString()
    @IsNotEmpty()
    img_url!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews!: IReview[];
}