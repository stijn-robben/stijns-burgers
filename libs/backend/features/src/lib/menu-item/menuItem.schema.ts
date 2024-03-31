import { IMenuItem, IReview} from "@herkansing-cswp/shared/api";
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsNumber, IsArray } from 'class-validator';
export type MenuItemDocument = MenuItem & Document;
export type ReviewDocument = Review & Document;

@Schema()
export class Review implements IReview{
    @IsMongoId()
    _id!: string;

    @IsNumber()
    @Prop({ required: true })
    score!: number;

    @IsString()
    @Prop({ required: true })
    description!: string;

    @IsMongoId()
    @Prop({ required: true })
    _id_user!: string;
}


@Schema()
export class MenuItem implements IMenuItem {

    @IsMongoId()
    _id!: string;

    @IsString()
    @Prop({ required: true })
    item_type!: string;

    @IsString()
    @Prop({ required: true })
    description!: string;

    @IsString()
    @Prop({ required: true })
    name!: string;

    @IsNumber()
    @Prop({ required: true })
    price!: number;

    @IsArray()
    @Prop({ required: true })
    ingredients!: string[];

    @IsArray()
    @Prop({ required: true })
    allergens!: string[];

    @IsString()
    @Prop({ required: true })
    img_url!: string;

      @Prop({ type: [Review], required: false })
  reviews!: Review[];

}
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
