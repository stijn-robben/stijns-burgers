import { Id } from './id.type';
import { ICartItem } from './cart-item.interface';
import { IOrder } from './order.interface';

export enum UserRole {
    admin = 'admin',
    user = 'user',
  }

export interface IUser {
    _id:Id;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    birthdate: Date;
    role: UserRole;
    postalCode: string;
    houseNumber: string; 
    phoneNumber: string; 
    token?: string | undefined;
    cart: ICartItem[];
    orders: IOrder[];
}

export type ICreateUser = Pick<
  IUser,
  'firstName' | 'lastName' | 'emailAddress' | 'password' | 'birthdate' | 'role' | 'postalCode' | 'houseNumber' | 'phoneNumber'
>;
export type IUpdateUser = Partial<Omit<IUser, '_id'>>;
export type IUpsertUser = IUser;