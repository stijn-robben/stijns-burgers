import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString, IsArray, IsNotEmpty } from 'class-validator';
import { CartItem, ICartItem, IOrder, IUser, Id, Order, UserRole } from '@herkansing-cswp/shared/api';
export type UserDocument = User & Document;

@Schema()
export class User implements IUser {

    @IsMongoId()
@Prop({ type: mongoose.Schema.Types.ObjectId })
_id!: Id;
    
    @IsNotEmpty()
    @IsString()
    @Prop()
    firstName!: string;

    @IsString()
    @Prop()
    lastName!: string;

    @IsString()
    @Prop()
    emailAddress!: string;

    @IsString()
    @Prop()
    password!: string;

    @Prop()
    birthdate!: Date;

    @Prop({type: String, enum: UserRole, default: UserRole.user })
    role!: UserRole;

    @IsString()
    @Prop()
    postalCode!: string;

    @IsString()
    @Prop()
    houseNumber!: string;

    @IsString()
    @Prop()
    phoneNumber!: string;

    @IsString()
    @Prop({ required: false })
    token?: string;

    @IsArray()
    @Prop({ type: [CartItem], required: false })
    cart!: ICartItem[];

    @IsArray()
    @Prop({ type: [Order], required: false})
    orders!: IOrder[];

    @IsArray()
    @Prop({ type: [{ type: String }], required: false })
    reviews!: string[];
}export const UserSchema = SchemaFactory.createForClass(User);
