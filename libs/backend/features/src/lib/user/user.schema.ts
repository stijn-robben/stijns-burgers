import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ICartItem, IOrder, IUser, Id, Order, UserRole } from '@herkansing-cswp/shared/api';
import { ApiProperty } from '@nestjs/swagger';
export type UserDocument = User & Document;

@Schema()
export class CartItem implements ICartItem{
    @IsMongoId()
    _id!: string;

    @ApiProperty({ description: 'The ID of the menu item' })
    @IsMongoId()
    @Prop({ required: true })
    menuItemId!: string;

    @ApiProperty({ description: 'The quantity of the product' })
    @IsNumber()
    @Prop({ required: true })
    quantity!: number;

    @ApiProperty({ description: 'The price of the product' })
    @IsNumber()
    @Prop({ required: true })
    price!: number;

    @ApiProperty({ description: 'The name of the product' })
    @IsString()
    @Prop({ required: true })
    nameProduct!: string;

    @ApiProperty({ description: 'The image URL of the product' })
    @IsString()
    @Prop({ required: true })
    productImageUrl!: string;

}


@Schema()
export class User implements IUser {

    @IsMongoId()
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id!: Id;
    
    @ApiProperty({ description: 'The first name of the user' })
    @IsNotEmpty()
    @IsString()
    @Prop()
    firstName!: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsString()
    @Prop()
    lastName!: string;

    @ApiProperty({ description: 'The email address of the user' })
    @IsString()
    @Prop()
    emailAddress!: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsString()
    @Prop()
    password!: string;

    @ApiProperty({ description: 'The birthdate of the user' })
    @Prop()
    birthdate!: Date;

    @ApiProperty({ description: 'The role of the user', enum: UserRole})
    @Prop({type: String, enum: UserRole, default: UserRole.user })
    role!: UserRole;

    @ApiProperty({ description: 'The postal code of the user' })
    @IsString()
    @Prop()
    postalCode!: string;

    @ApiProperty({ description: 'The house number of the user' })
    @IsString()
    @Prop()
    houseNumber!: string;

    @ApiProperty({ description: 'The phone number of the user' })
    @IsString()
    @Prop()
    phoneNumber!: string;

    @IsString()
    @Prop({ required: false })
    token?: string;

    @ApiProperty({ description: 'The cart of the user', type: [CartItem] })
    @IsArray()
    @Prop({ type: [CartItem], required: false })
    cart!: CartItem[];

    @ApiProperty({ description: 'The orders of the user', type: [Order] })
    @IsArray()
    @Prop({ type: [Order], required: false})
    orders!: IOrder[];

    @ApiProperty({ description: 'The reviews of the user', type: [String] })
    @IsArray()
    @Prop({ type: [{ type: String }], required: false })
    reviews!: string[];
}export const UserSchema = SchemaFactory.createForClass(User);
