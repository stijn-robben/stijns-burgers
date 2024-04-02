import { CartItem } from './cart-item.interface';
import { Id } from './id.type';

export enum Status {
    pending = 'pending',
    received = 'received',
    preparing = 'prepering',
    delivering = 'delivering',
    delivered = 'delivered',
  }


export interface IOrder {
    _id: Id;
    _id_user: Id;
    order_date: Date;
    status: string;
    total_amount: number;
    est_delivery_time: Date;
    cart: CartItem[];
}

export class Order implements IOrder {
    _id: Id;
    _id_user: Id;
    order_date: Date;
    status: Status;
    total_amount: number;
    est_delivery_time: Date;
    cart: CartItem[];

    constructor(_id: Id, _id_user: Id, order_date: Date, status: Status, total_amount: number, est_delivery_time: Date, cart: CartItem[]) {
        this._id = _id;
        this._id_user = _id_user; // corrected from this.user = user;
        this.order_date = order_date;
        this.status = status;
        this.total_amount = total_amount;
        this.est_delivery_time = est_delivery_time;
        this.cart = cart;
    }
}

export type ICreateOrder = Pick<
    IOrder,
    '_id_user' | 'order_date' | 'status' | 'total_amount' | 'est_delivery_time' | 'cart'
>;
export type IUpdateOrder = Partial<IOrder>;
export type IUpsertOrder = IOrder; 