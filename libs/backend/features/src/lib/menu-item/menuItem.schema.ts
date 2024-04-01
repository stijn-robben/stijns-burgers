import { IMenuItem, IReview} from "@herkansing-cswp/shared/api";
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export type MenuItemDocument = MenuItem & Document;
export type ReviewDocument = Review & Document;

@Schema()
export class Review implements IReview{
    @IsMongoId()
    _id!: string;

    @ApiProperty({ description: 'The score of the review' })
    @IsNumber()
    @Prop({ required: true })
    score!: number;

    @ApiProperty({ description: 'The description of the review' })
    @IsString()
    @Prop({ required: true })
    description!: string;

    @ApiProperty({ description: 'The ID of the user who wrote the review' })
    @IsMongoId()
    @Prop({ required: true })
    _id_user!: string;
}


@Schema()
export class MenuItem implements IMenuItem {

    @IsMongoId()
    _id!: string;

    @ApiProperty({ description: 'The type of the menu item' })
    @IsString()
    @Prop({ required: true })
    item_type!: string;

    @ApiProperty({ description: 'The description of the menu item' })
    @IsString()
    @Prop({ required: true })
    description!: string;

    @ApiProperty({ description: 'The name of the menu item' })
    @IsString()
    @Prop({ required: true })
    name!: string;

    @ApiProperty({ description: 'The price of the menu item' })
    @IsNumber()
    @Prop({ required: true })
    price!: number;

    @ApiProperty({ description: 'The ingredients of the menu item' })
    @IsArray()
    @Prop({ required: true })
    ingredients!: string[];

    @ApiProperty({ description: 'The allergens in the menu item'})
    @IsArray()
    @Prop({ required: true })
    allergens!: string[];

    @ApiProperty({ description: 'The image URL of the menu item' })
    @IsString()
    @Prop({ required: true })
    img_url!: string;
    
    @ApiProperty({ description: 'The reviews of the menu item', type: [Review] })
      @Prop({ type: [Review], required: false })
  reviews!: Review[];

}
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
