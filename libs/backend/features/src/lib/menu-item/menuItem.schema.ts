import { IMenuItem, IReview } from "@herkansing-cswp/shared/api";
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsNumber, IsArray } from 'class-validator';
export type MenuItemDocument = MenuItem & Document;

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

    @IsArray()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: false,
      })
      reviews!: IReview[];
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
