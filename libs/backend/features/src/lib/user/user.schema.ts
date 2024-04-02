import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ICartItem, IOrder, IReview, IUser, Id, Review, UserRole } from '@herkansing-cswp/shared/api';
import { ApiProperty } from '@nestjs/swagger';
export type UserDocument = User & Document;
export type OrderDocument = Order & Document;

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
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id_user!: string;

  @Prop({ required: true })
  order_date!: Date;

  @Prop({ required: true })
  status!: string;

  @Prop({ required: true })
  total_amount!: number;

  @Prop({ required: true })
  est_delivery_time!: Date;

  @Prop({ type: [CartItem], required: true })
  cart!: CartItem[];
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

    @ApiProperty({ description: 'The reviews of the user', type: [Review] })
    @IsArray()
    @Prop({ type: [{ type: [Review] }], required: false })
    reviews!: IReview[];
}export const UserSchema = SchemaFactory.createForClass(User);
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
export const OrderSchema = SchemaFactory.createForClass(Order);