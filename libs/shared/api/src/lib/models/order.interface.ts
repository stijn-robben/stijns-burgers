import { Id } from './id.type';
import { IUser } from './user.interface';

export enum Status {
    pending = 'pending',
    received = 'received',
    preparing = 'prepering',
    delivering = 'delivering',
    delivered = 'delivered',
  }


export interface IOrder {
    _id: Id;
    user: IUser;
    order_date: Date;
    status: string;
    total_amount: number;
    est_delivery_time: Date;
}

export class Order implements IOrder {
    _id: Id;
    user: IUser;
    order_date: Date;
    status: Status;
    total_amount: number;
    est_delivery_time: Date;

    constructor(_id: Id, user: IUser, order_date: Date, status: Status, total_amount: number, est_delivery_time: Date) {
        this._id = _id;
        this.user = user;
        this.order_date = order_date;
        this.status = status;
        this.total_amount = total_amount;
        this.est_delivery_time = est_delivery_time;
    }
}

export type ICreateOrder = Pick<
    IOrder,
    'user' | 'order_date' | 'status' | 'total_amount' | 'est_delivery_time'
>;
export type IUpdateOrder = Partial<Omit<IOrder, 'id'>>;
export type IUpsertOrder = IOrder;