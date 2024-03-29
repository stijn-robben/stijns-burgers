import { Id } from './id.type';
export interface ICartItem {
  _id: Id;
  menuItemId: Id;
  quantity: number;
  nameProduct: string;
  price: number;
  productImageUrl: string;
}

export type ICreateCartItem = Pick<
  ICartItem,
   'menuItemId' | 'quantity' | 'nameProduct' | 'price' | 'productImageUrl'
>;
export type IUpdateCartItem = Partial<Omit<ICartItem, 'id'>>;
export type IUpsertCartItem = ICartItem;